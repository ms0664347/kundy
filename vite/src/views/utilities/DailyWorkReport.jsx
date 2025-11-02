// material-ui
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { writeTextFile, readTextFile, BaseDirectory, mkdir } from '@tauri-apps/plugin-fs';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import { v4 as uuidv4 } from 'uuid';

// 自訂 components
import WorkReportForm from '../../ui-component/workReport/WorkReportForm';
import WorkReportTable from '../../ui-component/workReport/WorkReportTable';


export default function DailyWorkReport() {
    const [record, setRecord] = useState({
        location: '',
        amount: '',
        overtimePay: '',
        tax: 5,
        note: ''
    });

    const [date, setDate] = useState(dayjs());
    const [loadedData, setLoadedData] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedTool, setSelectedTool] = useState('');
    const [editPkno, setEditPkno] = useState(null); // ✅ 新增：記錄目前正在編輯的 pkno
    const [isEditing, setIsEditing] = useState(false); // ✅ 新增：是否為編輯模式

    const dirName = 'data';
    const fileName = `${ dirName }/DailyWorkReport.json`;

    const showAlert = (icon, title, text) => {
        Swal.fire({
            icon,
            title,
            text,
            confirmButtonColor: '#3085d6',
        });
    };

    // JSON 檔案通用讀取
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

        useEffect(() => { load(); }, []);
        return { items };
    }

    const companyStore = useJsonStore('company.json');
    const toolStore = useJsonStore('tool.json');

    // ✅ 儲存（包含 新增 / 編輯）
    const handleSave = async () => {
        try {
            await mkdir(dirName, { baseDir: BaseDirectory.AppData, recursive: true });

            let oldRecords = [];
            try {
                const existing = await readTextFile(fileName, { baseDir: BaseDirectory.AppData });
                oldRecords = JSON.parse(existing);
            } catch { oldRecords = []; }

            let newRecords = [];

            if (isEditing && editPkno) {
                // ✅ 編輯模式：更新該筆資料
                newRecords = oldRecords.map(item =>
                    item.pkno === editPkno
                        ? {
                            ...item,
                            company: selectedCompany,
                            tool: selectedTool,
                            location: record.location,
                            amount: record.amount,
                            tax: record.tax,
                            overtimePay: record.overtimePay,
                            note: record.note,
                            date: date ? date.format('YYYY/MM/DD') : ''
                        }
                        : item
                );
            } else {
                // ✅ 新增模式
                const newRecord = {
                    pkno: uuidv4(),
                    company: selectedCompany,
                    tool: selectedTool,
                    location: record.location,
                    amount: record.amount,
                    tax: record.tax,
                    overtimePay: record.overtimePay,
                    note: record.note,
                    date: date ? date.format('YYYY/MM/DD') : ''
                };
                newRecords = [...oldRecords, newRecord];
            }

            await writeTextFile(fileName, JSON.stringify(newRecords, null, 2), { baseDir: BaseDirectory.AppData });

            showAlert('success', isEditing ? '更新成功' : '儲存成功',
                isEditing ? '✅ 該筆資料已更新！' : '✅ 已成功儲存工作紀錄！');

            // ✅ 重置狀態
            setIsEditing(false);
            setEditPkno(null);
            resetForm();

            await handleLoad();
        } catch (err) {
            console.error('❌ 寫入失敗:', err);
            showAlert('error', '寫入失敗', '請聯絡工程師');
        }
    };

    // ✅ 讀取本月資料
    const handleLoad = async () => {
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

            // ✅ 過濾邏輯：若指定只看本月，並按照日期由新到舊排序
            const now = dayjs();
            const currentMonth = now.format('YYYY/MM');

            let filteredData = jsonData
                .filter(item =>
                    item.date && item.date.startsWith(currentMonth)
                )
                .sort((a, b) => {
                    const dateA = dayjs(a.date, 'YYYY/MM/DD');
                    const dateB = dayjs(b.date, 'YYYY/MM/DD');
                    return dateB.diff(dateA); // 降冪：最新的在最上面
                });

            setLoadedData(filteredData);

        } catch (err) {
            if (err.message?.includes('File not found')) {
                setLoadedData([]);
                return;
            }
            console.error('❌ 讀取失敗:', err);
            showAlert('warning', '發生錯誤', '請聯絡阿廷或阿夆工程師');
        }
    };

    // ✅ 刪除指定 pkno 的資料
    const handleDelete = async (pkno) => {
        try {
            const result = await Swal.fire({
                title: '確定要刪除這筆資料嗎？',
                text: '刪除後無法復原！',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: '是的，刪除！',
                cancelButtonText: '取消'
            });

            // ✅ 使用者按「取消」就直接 return
            if (!result.isConfirmed) {
                return;
            }

            // ✅ 確定後才執行刪除邏輯
            const content = await readTextFile(fileName, { baseDir: BaseDirectory.AppData });
            const jsonData = JSON.parse(content);
            const newList = jsonData.filter(item => item.pkno !== pkno);

            await writeTextFile(fileName, JSON.stringify(newList, null, 2), { baseDir: BaseDirectory.AppData });

            await Swal.fire({
                icon: 'success',
                title: '刪除成功',
                text: '🗑️ 該筆資料已被刪除！',
                confirmButtonColor: '#3085d6',
            });

            await handleLoad();

        } catch (err) {
            console.error('❌ 刪除失敗:', err);
            Swal.fire({
                icon: 'error',
                title: '刪除失敗',
                text: '發生錯誤，請聯絡阿廷或阿夆工程師！',
                confirmButtonColor: '#3085d6',
            });
        }
    };

    // ✅ 點擊「編輯」按鈕
    const handleEdit = (item) => {
        setIsEditing(true);
        setEditPkno(item.pkno);
        setSelectedCompany(item.company || '');
        setSelectedTool(item.tool || '');
        setRecord({
            location: item.location || '',
            amount: item.amount || '',
            overtimePay: item.overtimePay || '',
            tax: item.tax || 5,
            note: item.note || ''
        });
        setDate(dayjs(item.date, 'YYYY/MM/DD'));
    };

    // ✅ 重置表單與狀態
    const resetForm = () => {
        setRecord({ location: '', amount: '', overtimePay: '', tax: 5, note: '' });
        setSelectedCompany('');
        setSelectedTool('');
        setDate(dayjs());
        setIsEditing(false);
        setEditPkno(null);
    };


    useEffect(() => { handleLoad(); }, []);

    return (
        <MainCard
            title={
                <Typography
                    variant="h3"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '2rem',
                        color: '#333',
                    }}
                >
                    工作日誌管理
                </Typography>
            }
        >
            <Grid container spacing={gridSpacing}>
                <Grid size={{ xs: 12 }}>
                    <WorkReportForm
                        record={record}
                        setRecord={setRecord}
                        selectedCompany={selectedCompany}
                        setSelectedCompany={setSelectedCompany}
                        selectedTool={selectedTool}
                        setSelectedTool={setSelectedTool}
                        date={date}
                        setDate={setDate}
                        onSave={handleSave}
                        onLoad={handleLoad}
                        companyStore={companyStore}
                        toolStore={toolStore}
                        isEditing={isEditing} // ✅ 傳給 form 用來切換「更新」或「儲存」
                        onCancelEdit={resetForm}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <WorkReportTable
                        title="本月工作日誌列表"
                        loadedData={loadedData}
                        onEdit={(item) => handleEdit(item)}   // ✅ 傳 item 給 handleEdit
                        onDelete={(item) => handleDelete(item.pkno)}
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
}
