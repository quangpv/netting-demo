export class ArrayList<T> {
    private items = new Array<T>()

    push(item: T) {
        this.items.push(item)
    }

    remove(it: T) {
        const index = this.items.indexOf(it);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    forEach(param: (it: T) => void) {
        this.items.forEach(param)
    }

    find(accept: (T) => boolean): T | null {
        if (this.items.length === 0) return null
        for (let item of this.items) {
            if (accept(item)) return item
        }
        return null
    }

    getSize() {
        return this.items.length;
    }

    toArray() {
        return this.items;
    }
}