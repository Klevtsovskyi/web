Object.prototype.describe = function() {
    return "This object has keys: " + Object.keys(this).join(", ");
}

let a = {"123": "1-2-3", qwe: "zxc"}
let b =  new Object();
b["attr"] = 125;
b.asd = true;

console.log(a.describe());
console.log(b.describe());
