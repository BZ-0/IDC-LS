import { makeReactive } from "@unite/scripts/reactive/ReactiveLib.ts";

//
export class TaskManager {
    #tasks = [];
    #events = new Map([]);

    //
    constructor(tasks = []) {
        this.#tasks  = tasks || [];
        this.#events = new Map<string, Function[]>([]);

        //
        const hist = (_) => {
            this.focus(location.hash);
        };

        //
        addEventListener("hashchange", hist);
        addEventListener("popstate", hist);

        //
        this.focus(location.hash);
    }

    //
    trigger(name, ev = {}) {
        const events: Function[] = this.#events.get(name) || [];
        events.forEach((cb)=>cb(ev));
        return this;
    }

    //
    on(name, cb) {
        const events: Function[] = this.#events.get(name) || [];
        events.push(cb);
        this.#events.set(name, events);
        return this;
    }

    //
    get tasks() {
        return this.#tasks;
    }

    //
    getTasks() {
        return this.#tasks;
    }

    //
    focus(taskId: string) {
        this.activate(taskId);

        //
        const index = this.tasks.findIndex((t)=>t.id == taskId);
        if (index >= 0 && index < (this.tasks.length-1)) {
            const task = this.tasks[index];
            this.tasks.splice(index, 1);
            this.tasks.push(task);
            this.trigger("focus", {task, self: this, oldIndex: index, index: (this.tasks.length-1)});

            //
            if (location.hash != task.id)
                { history.back(); location.hash = task.id; };
        }
        return this;
    }

    //
    deactivate(taskId: string) {
        const index = this.tasks.findIndex((t)=>t.id == taskId);
        if (index >= 0) {
            const task = this.tasks[index];
            if (task.active) {
                task.active = false;
                this.trigger("deactivate", {task, self: this, index});
            }
        }
        return this;
    }

    //
    activate(taskId: string) {
        const index = this.tasks.findIndex((t)=>t.id == taskId);
        if (index >= 0) {
            const task = this.tasks[index];
            if (!task.active) {
                task.active = true;
                this.trigger("activate", {task, self: this, index});
            }
        }
        return this;
    }

    //
    addTask(task) {
        const index = this.tasks.findIndex((t)=>(t == task || t.id == task.id));
        const last = this.tasks.length;
        if (index < 0) {
            this.tasks.push(task);
            this.trigger("addTask", {task, self: this, index: last});
        } else {
            const exist = this.tasks[index];
            Object.assign(exist, task);
        }

        //
        this.focus(location.hash);
        return this;
    }

    //
    removeTask(taskId: string) {
        const index = this.tasks.findIndex((t)=>t.id == taskId);
        if (index >= 0) {
            const task = this.tasks[index];
            this.tasks.splice(index, 1);
            this.trigger("removeTask", {task, self: this, index: -1, oldIndex: index});
        }
        return this;
    }
}

//
export default new TaskManager();
