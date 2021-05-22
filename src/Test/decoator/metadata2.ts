import "reflect-metadata";

@printMetadataAll
class Plan {
  color: string = "red";

  @markFunction("hi there")
  fly(): void {
    console.log("i'm flying");
  }

  @markFunction("1")
  go1() {
    console.log("1");
  }

  @markFunction("2")
  go2() {
    console.log("2");
  }

  @markFunction("3")
  go3() {
    console.log("3");
  }

  @markFunction("4")
  go4() {
    console.log("4");
  }
}

// markFunction meta key 값은 secret value 값은 hi there

function markFunction(log: string) {
  // target  Plan.prototype
  // key     fly
  return function (target: any, key: string) {
    Reflect.defineMetadata("secret", log, target, key);
  };
}

function printMetadataAll(target: any) {
  const methods = Object.getOwnPropertyNames(target.prototype);
  console.log(methods);
  for (let key of methods) {
    const secret = Reflect.getMetadata("secret", target.prototype, key);
    console.log(secret);
  }
}

