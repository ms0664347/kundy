import React from 'react';
import {
    TextField, Button, Typography, FormControl,
    InputLabel, Select, MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SubCard from 'ui-component/cards/SubCard';

export default function WorkReportForm({
    record, setRecord,
    selectedCompany, setSelectedCompany,
    selectedTool, setSelectedTool,
    date, setDate,
    onSave, onLoad,
    companyStore, toolStore,
    isEditing, onCancelEdit
}) {
    const handleChange = (e) => {
        setRecord({ ...record, [e.target.name]: e.target.value });
    };

    return (
        <SubCard title={
            <Typography
                variant="h5"
                sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.6rem' }}
            >
                {isEditing ? '✏️ 編輯工作紀錄' : '📝 新增工作紀錄'}
            </Typography>
        }>
            <Grid container direction="column" spacing={1} sx={{ width: '80%', margin: '0 auto' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
                    <DatePicker
                        label="日期"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        format="YYYY/MM/DD"
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </LocalizationProvider>

                <FormControl fullWidth>
                    <InputLabel id="company-select-label">公司名稱</InputLabel>
                    <Select
                        labelId="company-select-label"
                        value={selectedCompany}
                        label="公司名稱"
                        onChange={(e) => setSelectedCompany(e.target.value)}
                    >
                        {(companyStore.items || []).map((name, index) => (
                            <MenuItem key={index} value={name}>{name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="tool-select-label">工具名稱</InputLabel>
                    <Select
                        labelId="tool-select-label"
                        value={selectedTool}
                        label="工具名稱"
                        onChange={(e) => setSelectedTool(e.target.value)}
                    >
                        {(toolStore.items || []).map((name, index) => (
                            <MenuItem key={index} value={name}>{name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField label="地點" name="location" value={record.location} onChange={handleChange} fullWidth />

                <Grid container direction="row" spacing={2}>
                    <Grid size={{ xs: 6 }}>
                        <TextField label="金額" name="amount" type="number" value={record.amount} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField label="稅金 (%)" name="tax" type="number" value={record.tax || ''} onChange={handleChange} fullWidth />
                    </Grid>
                </Grid>

                <TextField label="加班費" name="overtimePay" type="number" value={record.overtimePay || ''} onChange={handleChange} fullWidth />
                <TextField label="備註" name="note" value={record.note} onChange={handleChange} fullWidth />

                <Button variant="contained" color="primary" onClick={onSave}
                    sx={{
                        width: '40%',
                        backgroundColor: '#4d78ddff',     // ✅ 主色
                        borderColor: '#4171e2',
                        margin: '10px auto',
                        color: '#fff',
                        textTransform: 'none',
                        borderRadius: 2,
                        '&:hover': {
                            backgroundColor: '#3358d4',   // ✅ hover 顏色更深
                            boxShadow: '0 0 6px rgba(65,113,226,0.4)', // ✅ 微光暈效果
                        },
                    }}>{isEditing ? '🔄 更新' : '💾 儲存'}
                </Button>

                {isEditing && (
                    <Button variant="outlined" color="secondary" onClick={onCancelEdit}
                        sx={{
                            width: '40%',
                            margin: '10px auto',
                            textTransform: 'none',
                            borderRadius: 2,
                            color: '#d32f2f', // 🔹 直接指定文字顏色
                            borderColor: '#d32f2f', // 🔹 外框顏色同步
                            '&:hover': {
                                backgroundColor: '#e17a67ff',
                                color: '#fff', // 🔹 hover 時變白字
                                borderColor: '#e17a67ff',
                            },
                        }}
                    >
                        取消編輯
                    </Button>
                )}

            </Grid>
        </SubCard>
    );
}
