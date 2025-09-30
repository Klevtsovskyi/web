function Flower(length) {
    this.length = length;
}

Flower.prototype.toString = function() {
    return `довжини ${this.length}`
}
Flower.prototype.getPrice = function() {
    return 0.0;
}


function Tulip(length) {
    Flower.call(this, length);
}

Tulip.prototype.toString = function() {
    return "Тюльпан " + Flower.prototype.toString.call(this);
}
Tulip.prototype.getPrice = function() {
    return 44.3 + 3.1 * this.length;
}


function Cactus(length) {
    Flower.call(this, length);
}

Cactus.prototype.toString = function() {
    return "Кактус " + Flower.prototype.toString.call(this);
}
Cactus.prototype.getPrice = function() {
    return 70.8 + 2.2 * this.length;
}

function Bouquet(flowers) {
    this.flowers = flowers;
}

Bouquet.prototype.toString = function() {
    return "Букет: " + this.flowers.join(", ");
}
Bouquet.prototype.getPrice = function() {
    let price = 0.0;
    for (const flower of this.flowers) {
        price += flower.getPrice();
    }
    return price;
}


let arr = [
    new Tulip(9.2),
    new Cactus(8.1),
    new Tulip(12.5),
    new Cactus(6.2),
]

let bouquet = new Bouquet(arr);


console.log(bouquet.toString());
console.log(bouquet.getPrice());
