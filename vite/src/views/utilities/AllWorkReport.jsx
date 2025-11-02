// material-ui
import Grid from '@mui/material/Grid2';
import {
    Typography,
    Box,
    Select,
    MenuItem,
    TextField,
    Button,
    FormControl,
    InputLabel
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import Swal from 'sweetalert2';
import WorkReportTable from '../../ui-component/workReport/WorkReportTable';
import dayjs from 'dayjs';

export default function AllWorkReport() {
    const [loadedData, setLoadedData] = useState([]);
    const [allData, setAllData] = useState([]);

    // 🔍 篩選條件
    const [filters, setFilters] = useState({
        year: '',
        month: '',
        company: '',
        tool: '',
        location: '',
        keyword: ''
    });

    const dirName = 'data';
    const fileName = `${ dirName }/DailyWorkReport.json`;

    const showAlert = (icon, title, text) => {
        Swal.fire({
            icon,
            title,
            text,
            confirmButtonColor: '#3085d6'
        });
    };

    /** ✅ 共用 JSON 檔案讀取 Hook */
    function useJsonStore(fileName) {
        const [items, setItems] = useState([]);
        const filePath = `${ dirName }/${ fileName }`;

        const load = async () => {
            try {
                const content = await readTextFile(filePath, { baseDir: BaseDirectory.AppData });
                const jsonData = JSON.parse(content);
                setItems(jsonData || []);
            } catch {
                setItems([]);
            }
        };

        useEffect(() => {
            load();
        }, []);

        return { items };
    }

    // ✅ 讀取公司與工具
    const companyStore = useJsonStore('company.json');
    const toolStore = useJsonStore('tool.json');

    // ✅ 讀取所有 DailyWorkReport
    const handleLoadAll = async () => {
        try {
            const content = await readTextFile(fileName, { baseDir: BaseDirectory.AppData });
            if (!content || content.trim() === '') {
                setLoadedData([]);
                return;
            }

            const jsonData = JSON.parse(content);
            if (!jsonData || jsonData.length === 0) {
                setLoadedData([]);
                return;
            }

            // ✅ 日期由新到舊排序
            const sortedData = jsonData.sort((a, b) => new Date(b.date) - new Date(a.date));

            setAllData(sortedData);
            setLoadedData(sortedData);
        } catch (err) {
            if (err.message?.includes('File not found')) {
                setLoadedData([]);
                return;
            }
            console.error('❌ 讀取失敗:', err);
            showAlert('warning', '發生錯誤', '請聯絡阿廷或阿夆工程師');
        }
    };

    useEffect(() => {
        handleLoadAll();
    }, []);

    // ✅ 此頁僅檢視
    const handleDelete = async () => {
        Swal.fire({
            title: '目前此頁僅供檢視',
            text: '刪除請回「本月工作日誌管理」頁面進行操作。',
            icon: 'info',
            confirmButtonColor: '#3085d6'
        });
    };

    // ✅ 搜尋
    const handleSearch = () => {
        let filtered = [...allData];

        // 年月篩選
        if (filters.year) {
            filtered = filtered.filter((item) => item.date?.startsWith(filters.year));
        }
        if (filters.month) {
            filtered = filtered.filter((item) => {
                const [y, m] = item.date?.split('/') || [];
                return m === filters.month;
            });
        }

        if (filters.company) filtered = filtered.filter((item) => item.company === filters.company);
        if (filters.tool) filtered = filtered.filter((item) => item.tool === filters.tool);
        if (filters.location)
            filtered = filtered.filter((item) => item.location === filters.location);

        if (filters.keyword) {
            const kw = filters.keyword.toLowerCase();
            const toText = (v) => (Array.isArray(v) ? v.join(', ') : (v ?? ''));
            filtered = filtered.filter(
                (item) =>
                    toText(item.note).toLowerCase().includes(kw) ||
                    toText(item.company).toLowerCase().includes(kw) ||
                    toText(item.tool).toLowerCase().includes(kw) ||
                    toText(item.location).toLowerCase().includes(kw)
            );
        }

        setLoadedData(filtered);
    };

    // ✅ 重置篩選條件
    const handleReset = () => {
        setFilters({ year: '', month: '', company: '', tool: '', location: '', keyword: '' });
        setLoadedData(allData);
    };

    // ✅ 年份選項（從資料動態生成）
    const uniqueYears = Array.from(
        new Set(allData.map((item) => item.date?.split('/')[0]).filter(Boolean))
    ).sort((a, b) => b - a);

    // ✅ 月份選項（1~12固定）
    const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

    return (
        <MainCard
            title={
                <Typography
                    variant="h3"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '2rem',
                        color: '#333'
                    }}
                >
                    所有工作日誌報表
                </Typography>
            }
        >
            {/* 🔍 搜尋列 */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    mb: 3
                }}
            >
                {/* 年份 */}
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>年份</InputLabel>
                    <Select
                        value={filters.year}
                        label="年份"
                        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                    >
                        <MenuItem value="">全部</MenuItem>
                        {uniqueYears.map((y, index) => (
                            <MenuItem key={index} value={y}>
                                {y} 年
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* 月份 */}
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>月份</InputLabel>
                    <Select
                        value={filters.month}
                        label="月份"
                        onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                    >
                        <MenuItem value="">全部</MenuItem>
                        {months.map((m) => (
                            <MenuItem key={m} value={m}>
                                {m} 月
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* 公司 */}
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>公司</InputLabel>
                    <Select
                        value={filters.company}
                        label="公司"
                        onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                    >
                        <MenuItem value="">全部</MenuItem>
                        {companyStore.items.map((name, index) => (
                            <MenuItem key={index} value={name}>
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* 工具 */}
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>工具</InputLabel>
                    <Select
                        value={filters.tool}
                        label="工具"
                        onChange={(e) => setFilters({ ...filters, tool: e.target.value })}
                    >
                        <MenuItem value="">全部</MenuItem>
                        {toolStore.items.map((name, index) => (
                            <MenuItem key={index} value={name}>
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* 地點 */}
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>地點</InputLabel>
                    <Select
                        value={filters.location}
                        label="地點"
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    >
                        <MenuItem value="">全部</MenuItem>
                        {Array.from(new Set(allData.map((i) => i.location).filter(Boolean))).map(
                            (loc, index) => (
                                <MenuItem key={index} value={loc}>
                                    {loc}
                                </MenuItem>
                            )
                        )}
                    </Select>
                </FormControl>

                {/* 關鍵字 */}
                <TextField
                    label="搜尋關鍵字"
                    variant="outlined"
                    value={filters.keyword}
                    onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                    sx={{ minWidth: 200 }}
                />

                {/* 搜尋按鈕 */}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ height: '56px' }}
                    onClick={handleSearch}
                >
                    🔍 搜尋
                </Button>

                {/* 重置按鈕 */}
                <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ height: '56px' }}
                    onClick={handleReset}
                >
                    ♻️ 重置
                </Button>
            </Box>

            {/* 📋 表格 */}
            <Grid container spacing={gridSpacing}>
                <Grid size={{ xs: 12 }}>
                    <WorkReportTable
                        title=""
                        loadedData={loadedData || []}
                        onEdit={() => { }}
                        onDelete={handleDelete}
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
}
