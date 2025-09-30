function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function () {
    console.log(`${this.name} видає звук!`);
}


function Dog(name, breed) {
    Animal.call(this, name);
    this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function () {
    console.log(`${this.name} породи ${this.breed} гавкає!`);
}


let sharik = new Animal("Шарік");
sharik.speak();

let bobik = new Dog("Бобік", "Бродяга");
let tuzik = new Dog("Тузік", "Лабрадор");
bobik.speak();
tuzik.speak();
