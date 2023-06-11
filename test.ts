interface testInt {
  show: any;
  notShow: any;
}

class Test implements testInt {
  show: any;
  notShow: any;
  constructor() {
    this.show = null;
    this.notShow = undefined;
  }
}

const newTest = new Test();

console.log(newTest);
