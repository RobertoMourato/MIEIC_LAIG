class Player {
    constructor(id, type, color) {
        this.id = id
        this.type = type
        this.color = color
    }

    getType() {
        return this.type;
    }

    setType(Type) {
        this.type = Type;
    }

    getColor() {
        return this.color;
    }

    setColor(Color) {
        this.color = Color;
    }

    getName() {
        return this.name;
    }

    setName(Name) {
        this.name = Name;
    }
}