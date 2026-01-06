import { prisma } from "../../config/database.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import {generateRefreshToken, generateToken} from "../../utils/jwt.js";
import {throwError} from "../../utils/error.js";

//
// REGISTER
//
export const register = async (lastname, firstname, username, password, role) => {
    // Check if username already exists
    const existing = await prisma.user.findUnique({
        where: { username }
    });

    if (existing) throwError(409, "This username already exists.");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
        throwError(
            400,
            "Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, and one number"
        )
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
        data: {
            lastname,
            firstname,
            username,
            password: hashedPassword,
        },
        select: {
            id: true,
            lastname: true,
            firstname: true,
            username: true,
        },
    });

    // If student → create Student entry
    if (role === "student") {
        await prisma.student.create({
            data: {
                id: user.id,
                completed_qcm_count: 0,
                average_qcm_score: 0,
            },
        });
    }

    // If teacher → create Teacher entry
    if (role === "teacher") {
        await prisma.teacher.create({
            data: {
                id: user.id,
                created_qcm_count: 0,
            },
        });
    }

    const refresh_token = generateRefreshToken()
    await updateRefreshToken(user.id, refresh_token);

    return {
        ...user,
        role,
        access_token: generateToken({ id: user.id, role }),
        refresh_token: refresh_token
    };
};

//
// LOGIN
//
export const login = async (username, password) => {
    // Fetch user for password check
    const authUser = await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            password: true,
        },
    });

    if (!authUser) throwError(404, "User not found.");

    // Compare password
    const valid = await comparePassword(password, authUser.password);
    if (!valid) throwError(401, "Invalid password.");

    // Fetch user without password
    const user = await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            lastname: true,
            firstname: true,
            username: true,
        }
    });

    // Detect role
    let role = await getUserRole(user.id);

    const refresh_token = generateRefreshToken()
    await updateRefreshToken(user.id, refresh_token);

    return {
        ...user,
        role,
        access_token: generateToken({ id: user.id, role }),
        refresh_token: refresh_token
    };
};

export const getCurrentSession = async (id) => {
    if (!id) throwError(400, "User ID is required");

    const user = await prisma.user.findUnique({
        where: { id: id },
        select: {
            id: true,
            username: true,
            lastname: true,
            firstname: true,
        }
    });

    if (!user) throwError(404, "User not found");

    let role = await getUserRole(user.id);

    return { ...user, role };
};

export const getUserFromRefreshToken = async (token) => {
    const user = await prisma.user.findFirst({
        where: {
            refresh_token: token,
            refresh_token_expires_at: {
                gt: new Date()
            }
        },
        select: {
            id: true,
            lastname: true,
            firstname: true,
            username: true,
        }
    });

    if (!user) throwError(401,  "Invalid or expired refresh token.");

    // Detect role (student/teacher)
    let role = await getUserRole(user.id);

    // New access token
    const accessToken = generateToken({ id: user.id, role });
    const refresh_token = generateRefreshToken()
    await updateRefreshToken(user.id, refresh_token);

    return {
        ...user,
        role,
        access_token: accessToken,
        refresh_token: refresh_token
    };
}

async function getUserRole(userId) {
    if (await prisma.student.findUnique({ where: { id: userId } })) return "student";
    if (await prisma.teacher.findUnique({ where: { id: userId } })) return "teacher";
    return null;
}

async function updateRefreshToken(userId, newRefreshToken) {
    try{
        await prisma.user.update({
            where: { id: userId },
            data: {
                refresh_token: newRefreshToken,
                refresh_token_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        });
    }
    catch (err){
        throwError(500, "Failed to update refresh token.");
    }
}
