import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    Paper,
} from "@mui/material";
import { invoke } from "@tauri-apps/api/core";

export default function TalkToAI() {
    const [messages, setMessages] = useState([]); // { role: 'user' | 'ai', text: '' }
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);

    // 自動捲到底
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /** ⛓️ 傳送訊息 (使用 Tauri invoke → call_gemini) */
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setInput("");

        try {
            const reply = await invoke("call_gemini", { prompt: userMessage });

            let replyText = "(AI 無回覆內容)";
            try {
                const parsed = JSON.parse(reply);
                replyText =
                    parsed?.candidates?.[0]?.content?.parts?.[0]?.text ??
                    "(AI 無回覆內容)";
            } catch {
                replyText = reply;
            }

            setMessages((prev) => [...prev, { role: "ai", text: replyText }]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "ai", text: `⚠️ 錯誤：${err}` },
            ]);
        }
    };

    // Enter 送出
    const handleKeyDown = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <Box
            p={3}
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
            <Typography variant="h4" fontWeight="bold" mb={2}>
                💬 Talk to AI
            </Typography>

            {/* 聊天區 */}
            <Paper
                elevation={3}
                sx={{
                    flexGrow: 1,
                    p: 2,
                    overflowY: "auto",
                    borderRadius: 2,
                    background: "#f7f9fc",
                }}
            >
                {messages.map((m, idx) => (
                    <Grid
                        key={idx}
                        container
                        justifyContent={m.role === "user" ? "flex-end" : "flex-start"}
                        mb={1}
                    >
                        <Box
                            sx={{
                                maxWidth: "70%",
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: m.role === "user" ? "#1976d2" : "#eceff1",
                                color: m.role === "user" ? "#fff" : "#000",
                            }}
                        >
                            <Typography whiteSpace="pre-line">{m.text}</Typography>
                        </Box>
                    </Grid>
                ))}
                <div ref={chatEndRef}></div>
            </Paper>

            {/* 下方輸入列 */}
            <Grid container spacing={2} mt={2}>
                <Grid item xs={10}>
                    <TextField
                        fullWidth
                        value={input}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="輸入訊息..."
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ height: "100%" }}
                        onClick={sendMessage}
                    >
                        發送
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
