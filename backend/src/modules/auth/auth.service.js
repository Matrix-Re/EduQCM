import prisma from "../../config/db.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { generateToken } from "../../utils/jwt.js";

//
// REGISTER
//
export const registerUser = async (data) => {
    const { lastName, firstName, username, password, role } = data;

    // Check if username already exists
    const existing = await prisma.user.findUnique({
        where: { username }
    });

    if (existing) throw new Error("This username already exists.");

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
        data: {
            lastName,
            firstName,
            username,
            password: hashedPassword,
        },
        select: {
            UserId: true,
            lastName: true,
            firstName: true,
            username: true,
        },
    });

    // If student → create Student entry
    if (role === "student") {
        await prisma.student.create({
            data: {
                UserId: user.UserId,
                completedQCMCount: 0,
                averageQCMScore: 0,
            },
        });
    }

    // If teacher → create Teacher entry
    if (role === "teacher") {
        await prisma.teacher.create({
            data: {
                UserId: user.UserId,
                createdQCMCount: 0,
            },
        });
    }

    return {
        user,
        role,
        token: generateToken({ userId: user.UserId, role })
    };
};

//
// LOGIN
//
export const loginUser = async (username, password) => {
    // Fetch user for password check
    const authUser = await prisma.user.findUnique({
        where: { username },
        select: {
            UserId: true,
            username: true,
            password: true,
        },
    });

    if (!authUser) throw new Error("User not found.");

    // Compare password
    const valid = await comparePassword(password, authUser.password);
    if (!valid) throw new Error("Incorrect password.");

    // Fetch user without password
    const user = await prisma.user.findUnique({
        where: { username },
        select: {
            UserId: true,
            lastName: true,
            firstName: true,
            username: true,
        }
    });

    // Detect role
    let role = null;

    const student = await prisma.student.findUnique({
        where: { UserId: user.UserId }
    });

    if (student) role = "student";

    const teacher = await prisma.teacher.findUnique({
        where: { UserId: user.UserId }
    });

    if (teacher) role = "teacher";

    return {
        user,
        role,
        token: generateToken({ userId: user.UserId, role })
    };
};
