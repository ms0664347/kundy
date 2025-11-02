import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Box } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { writeTextFile, readTextFile, BaseDirectory, mkdir } from '@tauri-apps/plugin-fs';
import Swal from 'sweetalert2';

/** ✅ 共用 Hook：管理 JSON 檔案 CRUD */
function useJsonStore(fileName) {
    const [items, setItems] = useState([]);

    const dirName = 'data';
    const filePath = `${ dirName }/${ fileName }`;

    // 讀取 JSON
    const load = async () => {
        try {
            const content = await readTextFile(filePath, { baseDir: BaseDirectory.AppData });
            const jsonData = JSON.parse(content);
            setItems(jsonData || []);
        } catch {
            console.warn(`⚠ 尚無 ${ fileName } 紀錄`);
            setItems([]);
        }
    };

    // 儲存 JSON
    const save = async (newData) => {
        await mkdir(dirName, { baseDir: BaseDirectory.AppData, recursive: true });
        await writeTextFile(filePath, JSON.stringify(newData, null, 2), {
            baseDir: BaseDirectory.AppData,
        });
    };

    // 新增
    const add = async (item) => {
        const newList = [...new Set([...items, item.trim()])];
        setItems(newList);
        await save(newList);
    };

    // 刪除
    const remove = async (item) => {
        const newList = items.filter((i) => i !== item);
        setItems(newList);
        await save(newList);
    };

    useEffect(() => {
        load();
    }, []);

    return { items, add, remove };
}

/** 🏗 主頁面 */
export default function Company() {
    const [record, setRecord] = useState({ company: '', tool: '' });
    const [selectedCompany, setSelectedCompany] = useState('');

    const companyStore = useJsonStore('company.json');

    const handleChange = (e) => {
        setRecord({ ...record, [e.target.name]: e.target.value });
    };

    // ✅ SweetAlert Helper
    const showAlert = (icon, title, text) => {
        Swal.fire({
            icon,
            title,
            text,
            confirmButtonColor: '#3085d6',
        });
    };

    return (
        <MainCard title="公司與工具管理（共用 JSON 邏輯）">
            <Grid container spacing={gridSpacing}>
                {/* 公司區塊 */}
                <Grid size={{ xs: 12 }}>
                    <SubCard title={
                        <Typography
                            variant="h3"
                            sx={{
                                textAlign: 'center',
                                width: '100%',
                                fontWeight: 'bold'
                            }}
                        >
                            公司設定
                        </Typography>
                    }>
                        <Grid
                            sx={{
                                width: {
                                    xs: '100%',  // 手機滿版
                                    sm: '80%',   // 平板以上 80%
                                    md: '60%',   // 桌機 60%
                                },
                                margin: '0 auto'
                            }}
                        >
                            <Grid container direction="column" spacing={1}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        width: '100%',
                                        backgroundColor: '#f1f1f1ff',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        mb: '8px',
                                        color: '#333',
                                        textAlign: 'center',
                                        mt: 6,
                                    }}
                                >
                                    新增公司
                                </Typography>
                                <Grid container direction="column" spacing={1}>
                                    <TextField
                                        label="公司名稱"
                                        name="company"
                                        value={record.company}
                                        onChange={handleChange}
                                        fullWidth
                                    />

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={async () => {
                                            if (!record.company.trim()) {
                                                return showAlert('warning', '請輸入公司名稱', '');
                                            }
                                            await companyStore.add(record.company);
                                            showAlert('success', '儲存成功', `公司 "${ record.company }" 已新增！`);
                                        }}
                                        sx={{
                                            width: '40%',
                                            backgroundColor: '#4171e2ff',
                                            margin: '10px auto',
                                            color: '#fff',
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            '&:hover': { backgroundColor: '#1c27f9ff' },
                                        }}
                                    >
                                        💾 儲存公司
                                    </Button>

                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            width: '100%',
                                            backgroundColor: '#ff6969ff',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            mb: '8px',
                                            color: '#333',
                                            textAlign: 'center',
                                            mt: 6,
                                        }}
                                    >
                                        刪除公司
                                    </Typography>
                                    <FormControl fullWidth>
                                        <InputLabel id="company-select-label">公司名稱</InputLabel>
                                        <Select
                                            labelId="company-select-label"
                                            value={selectedCompany}
                                            label="公司名稱"
                                            onChange={(e) => setSelectedCompany(e.target.value)}
                                        >
                                            {(companyStore.items || []).map((name, index) => (
                                                <MenuItem key={index} value={name}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>


                                    <Button
                                        variant="contained"
                                        color="error"
                                        disabled={!selectedCompany}
                                        onClick={async (e) => {
                                            if (!selectedCompany) return;
                                            const result = await Swal.fire({
                                                title: `確定刪除公司 "${ selectedCompany }"？`,
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#d33',
                                                cancelButtonColor: '#3085d6',
                                                confirmButtonText: '刪除',
                                                cancelButtonText: '取消',
                                            });
                                            if (result.isConfirmed) {
                                                await companyStore.remove(selectedCompany);
                                                setSelectedCompany('');
                                                showAlert('success', '刪除成功', '公司資料已移除');
                                            }
                                        }}
                                        sx={{
                                            width: '40%',
                                            backgroundColor: '#f96262ff',
                                            margin: '10px auto',
                                            color: '#fff',
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            '&:hover': { backgroundColor: '#f71d1dff' },
                                        }}
                                    >
                                        🗑 刪除
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </SubCard>
                </Grid>
            </Grid>
        </MainCard>
    );
}
