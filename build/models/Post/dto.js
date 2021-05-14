"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
class PostDto {
}
__decorate([
    class_validator_1.IsString()
], PostDto.prototype, "position", void 0);
__decorate([
    class_validator_1.IsString()
], PostDto.prototype, "title", void 0);
__decorate([
    class_validator_1.IsString()
], PostDto.prototype, "content", void 0);
__decorate([
    class_validator_1.IsInt()
], PostDto.prototype, "personnel", void 0);
__decorate([
    class_validator_1.IsString()
], PostDto.prototype, "meeting", void 0);
__decorate([
    class_validator_1.IsString()
], PostDto.prototype, "category", void 0);
__decorate([
    class_validator_1.ArrayMinSize(1),
    class_validator_1.IsString({ each: true })
], PostDto.prototype, "hashtag", void 0);
__decorate([
    class_validator_1.IsNumber({}, { each: true }),
    class_validator_1.ArrayMaxSize(2)
], PostDto.prototype, "location", void 0);
__decorate([
    class_validator_1.IsString()
], PostDto.prototype, "address", void 0);
__decorate([
    class_validator_1.IsString()
], PostDto.prototype, "address_name", void 0);
__decorate([
    class_validator_1.IsDateString()
], PostDto.prototype, "startDate", void 0);
__decorate([
    class_validator_1.IsDateString()
], PostDto.prototype, "dueDate", void 0);
exports.default = PostDto;
