var TaskService_1;
import { __decorate, __metadata, __param } from "tslib";
import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable, Logger, NotFoundException, } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { UnknownElementException } from '@nestjs/core/errors/exceptions/unknown-element.exception';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { isEmpty, isNil } from 'lodash';
import { Like, Repository } from 'typeorm';
import { InjectRedis } from '~/common/decorators/inject-redis.decorator';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorEnum } from '~/constants/error-code.constant';
import { paginate } from '~/helper/paginate';
import { TaskEntity } from '~/modules/system/task/task.entity';
import { MISSION_DECORATOR_KEY } from '~/modules/tasks/mission.decorator';
import { SYS_TASK_QUEUE_NAME, SYS_TASK_QUEUE_PREFIX, TaskStatus, } from './constant';
let TaskService = TaskService_1 = class TaskService {
    constructor(taskRepository, taskQueue, moduleRef, reflector, redis) {
        this.taskRepository = taskRepository;
        this.taskQueue = taskQueue;
        this.moduleRef = moduleRef;
        this.reflector = reflector;
        this.redis = redis;
        this.logger = new Logger(TaskService_1.name);
    }
    /**
     * module init
     */
    async onModuleInit() {
        await this.initTask();
    }
    /**
     * 初始化任务，系统启动前调用
     */
    async initTask() {
        const initKey = `${SYS_TASK_QUEUE_PREFIX}:init`;
        // 防止重复初始化
        const result = await this.redis
            .multi()
            .setnx(initKey, new Date().getTime())
            .expire(initKey, 60 * 30)
            .exec();
        if (result[0][1] === 0) {
            // 存在锁则直接跳过防止重复初始化
            this.logger.log('Init task is lock', TaskService_1.name);
            return;
        }
        const jobs = await this.taskQueue.getJobs([
            'active',
            'delayed',
            'failed',
            'paused',
            'waiting',
            'completed',
        ]);
        jobs.forEach((j) => {
            j.remove();
        });
        // 查找所有需要运行的任务
        const tasks = await this.taskRepository.findBy({ status: 1 });
        if (tasks && tasks.length > 0) {
            for (const t of tasks)
                await this.start(t);
        }
        // 启动后释放锁
        await this.redis.del(initKey);
    }
    async list({ page, pageSize, name, service, type, status, }) {
        const queryBuilder = this.taskRepository
            .createQueryBuilder('task')
            .where({
            ...(name ? { name: Like(`%${name}%`) } : null),
            ...(service ? { service: Like(`%${service}%`) } : null),
            ...(type ? { type } : null),
            ...(!isNil(status) ? { status } : null),
        })
            .orderBy('task.id', 'ASC');
        return paginate(queryBuilder, { page, pageSize });
    }
    /**
     * task info
     */
    async info(id) {
        const task = this.taskRepository
            .createQueryBuilder('task')
            .where({ id })
            .getOne();
        if (!task)
            throw new NotFoundException('Task Not Found');
        return task;
    }
    /**
     * delete task
     */
    async delete(task) {
        if (!task)
            throw new BadRequestException('Task is Empty');
        await this.stop(task);
        await this.taskRepository.delete(task.id);
    }
    /**
     * 手动执行一次
     */
    async once(task) {
        if (task) {
            await this.taskQueue.add({ id: task.id, service: task.service, args: task.data }, { jobId: task.id, removeOnComplete: true, removeOnFail: true });
        }
        else {
            throw new BadRequestException('Task is Empty');
        }
    }
    async create(dto) {
        const result = await this.taskRepository.save(dto);
        const task = await this.info(result.id);
        if (result.status === 0)
            await this.stop(task);
        else if (result.status === TaskStatus.Activited)
            await this.start(task);
    }
    async update(id, dto) {
        await this.taskRepository.update(id, dto);
        const task = await this.info(id);
        if (task.status === 0)
            await this.stop(task);
        else if (task.status === TaskStatus.Activited)
            await this.start(task);
    }
    /**
     * 启动任务
     */
    async start(task) {
        if (!task)
            throw new BadRequestException('Task is Empty');
        // 先停掉之前存在的任务
        await this.stop(task);
        let repeat;
        if (task.type === 1) {
            // 间隔 Repeat every millis (cron setting cannot be used together with this setting.)
            repeat = {
                every: task.every,
            };
        }
        else {
            // cron
            repeat = {
                cron: task.cron,
            };
            // Start date when the repeat job should start repeating (only with cron).
            if (task.startTime)
                repeat.startDate = task.startTime;
            if (task.endTime)
                repeat.endDate = task.endTime;
        }
        if (task.limit > 0)
            repeat.limit = task.limit;
        const job = await this.taskQueue.add({ id: task.id, service: task.service, args: task.data }, { jobId: task.id, removeOnComplete: true, removeOnFail: true, repeat });
        if (job && job.opts) {
            await this.taskRepository.update(task.id, {
                jobOpts: JSON.stringify(job.opts.repeat),
                status: 1,
            });
        }
        else {
            // update status to 0，标识暂停任务，因为启动失败
            await job?.remove();
            await this.taskRepository.update(task.id, {
                status: TaskStatus.Disabled,
            });
            throw new BadRequestException('Task Start failed');
        }
    }
    /**
     * 停止任务
     */
    async stop(task) {
        if (!task)
            throw new BadRequestException('Task is Empty');
        const exist = await this.existJob(task.id.toString());
        if (!exist) {
            await this.taskRepository.update(task.id, {
                status: TaskStatus.Disabled,
            });
            return;
        }
        const jobs = await this.taskQueue.getJobs([
            'active',
            'delayed',
            'failed',
            'paused',
            'waiting',
            'completed',
        ]);
        jobs
            .filter(j => j.data.id === task.id)
            .forEach(async (j) => {
            await j.remove();
        });
        // 在队列中删除当前任务
        await this.taskQueue.removeRepeatable(JSON.parse(task.jobOpts));
        await this.taskRepository.update(task.id, { status: TaskStatus.Disabled });
        // if (task.jobOpts) {
        //   await this.app.queue.sys.removeRepeatable(JSON.parse(task.jobOpts));
        //   // update status
        //   await this.getRepo().admin.sys.Task.update(task.id, { status: TaskStatus.Disabled, });
        // }
    }
    /**
     * 查看队列中任务是否存在
     */
    async existJob(jobId) {
        // https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueremoverepeatablebykey
        const jobs = await this.taskQueue.getRepeatableJobs();
        const ids = jobs.map((e) => {
            return e.id;
        });
        return ids.includes(jobId);
    }
    /**
     * 更新是否已经完成，完成则移除该任务并修改状态
     */
    async updateTaskCompleteStatus(tid) {
        const jobs = await this.taskQueue.getRepeatableJobs();
        const task = await this.taskRepository.findOneBy({ id: tid });
        // 如果下次执行时间小于当前时间，则表示已经执行完成。
        for (const job of jobs) {
            const currentTime = new Date().getTime();
            if (job.id === tid.toString() && job.next < currentTime) {
                // 如果下次执行时间小于当前时间，则表示已经执行完成。
                await this.stop(task);
                break;
            }
        }
    }
    /**
     * 检测service是否有注解定义
     */
    async checkHasMissionMeta(nameOrInstance, exec) {
        try {
            let service;
            if (typeof nameOrInstance === 'string')
                service = await this.moduleRef.get(nameOrInstance, { strict: false });
            else
                service = nameOrInstance;
            // 所执行的任务不存在
            if (!service || !(exec in service))
                throw new NotFoundException('任务不存在');
            // 检测是否有Mission注解
            const hasMission = this.reflector.get(MISSION_DECORATOR_KEY, service.constructor);
            // 如果没有，则抛出错误
            if (!hasMission)
                throw new BusinessException(ErrorEnum.INSECURE_MISSION);
        }
        catch (e) {
            if (e instanceof UnknownElementException) {
                // 任务不存在
                throw new NotFoundException('任务不存在');
            }
            else {
                // 其余错误则不处理，继续抛出
                throw e;
            }
        }
    }
    /**
     * 根据serviceName调用service，例如 LogService.clearReqLog
     */
    async callService(name, args) {
        if (name) {
            const [serviceName, methodName] = name.split('.');
            if (!methodName)
                throw new BadRequestException('serviceName define BadRequestException');
            const service = await this.moduleRef.get(serviceName, {
                strict: false,
            });
            // 安全注解检查
            await this.checkHasMissionMeta(service, methodName);
            if (isEmpty(args)) {
                await service[methodName]();
            }
            else {
                // 参数安全判断
                const parseArgs = this.safeParse(args);
                if (Array.isArray(parseArgs)) {
                    // 数组形式则自动扩展成方法参数回掉
                    await service[methodName](...parseArgs);
                }
                else {
                    await service[methodName](parseArgs);
                }
            }
        }
    }
    safeParse(args) {
        try {
            return JSON.parse(args);
        }
        catch (e) {
            return args;
        }
    }
};
TaskService = TaskService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(TaskEntity)),
    __param(1, InjectQueue(SYS_TASK_QUEUE_NAME)),
    __param(4, InjectRedis()),
    __metadata("design:paramtypes", [Repository, Object, ModuleRef,
        Reflector,
        Redis])
], TaskService);
export { TaskService };
//# sourceMappingURL=task.service.js.map