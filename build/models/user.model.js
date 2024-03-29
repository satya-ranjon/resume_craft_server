"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please enter the name !"],
    },
    email: {
        type: String,
        required: [true, "Please enter the email !"],
        validate: {
            validator: function (value) {
                return __awaiter(this, void 0, void 0, function* () {
                    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
                });
            },
        },
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters !"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            default: "",
        },
        url: {
            type: String,
            default: "",
        },
    },
    role: {
        type: String,
        default: "user",
    },
    socialLogin: {
        type: Boolean,
        default: false,
    },
    plan: {
        type: {
            type: String,
            required: true,
            enum: ["premium", "enterprise", "free"],
            default: "free",
        },
        downloadlimite: {
            type: Number,
            default: 10,
        },
        checkoutDate: {
            type: Number,
            default: Date.now,
        },
        timeLimite: {
            type: Number,
            default: 30,
        },
    },
}, { timestamps: true, versionKey: false });
// Hash Password before saving
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!this.isModified("password")) {
                return next();
            }
            this.password = yield bcrypt_1.default.hash(this.password, 10);
            return next();
        }
        catch (error) {
            return next(error);
        }
    });
});
// Compare password
userSchema.methods.comparePassword = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(enteredPassword, this.password);
    });
};
// Sign Access token
userSchema.methods.SignAccessToken = function () {
    try {
        return jsonwebtoken_1.default.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET || "", {
            expiresIn: "5m",
        });
    }
    catch (error) {
        throw new Error("Error signing access token");
    }
};
// Sign Refresh token
userSchema.methods.SignRefreshToken = function () {
    try {
        return jsonwebtoken_1.default.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET || "", {
            expiresIn: "3d",
        });
    }
    catch (error) {
        throw new Error("Error signing refresh token");
    }
};
const userModel = mongoose_1.default.model("User", userSchema);
exports.default = userModel;
