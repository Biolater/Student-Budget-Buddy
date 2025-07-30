'use server'

import { apiRequest } from "../lib/apiClient";
import { ResponseHandler } from "../lib/ResponseHandler";
import { requireUser } from "../utils/auth.utils";

export const sendAiMessage = async (message: string) => {
    if (typeof message !== 'string' || message.trim().length === 0) {
        throw new Error('Message must be a string')
    }
    const user = await requireUser();
    const token = await user.getToken();

    if (!token) {
        throw new Error("Unable to get authentication token");
    }

    const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'
        : 'https://student-budget-buddy-backend.onrender.com' // This will need to be replaced with actual production URL

    return ResponseHandler.execute(async () => {
        const response = await fetch(`${baseUrl}/api/v1/ai/assistant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },  
            body: JSON.stringify({
                message
            })
        });

        const data = await response.json();

        return data.data;
    })
}

export const sendAiMessageStream = async (message: string) => {
    if (typeof message !== 'string' || message.trim().length === 0) {
        throw new Error('Message must be a string')
    }
    const user = await requireUser();
    const token = await user.getToken();

    if (!token) {
        throw new Error("Unable to get authentication token");
    }

    const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'
        : 'https://student-budget-buddy-backend.onrender.com' // This will need to be replaced with actual production URL

    const response = await fetch(`${baseUrl}/api/v1/ai/assistant/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },  
        body: JSON.stringify({
            message
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
}