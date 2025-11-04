import React, { useState } from 'react';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Stack,
    Box,
    Pagination,
    Checkbox
} from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';

export default function WorkReportTable({
    title = '',
    loadedData = [],
    onEdit,
    onDelete,
    onSelectionChange, // ✅ 新增 callback
    resetKey, // ✅ 新增：父層控制清空用
    pageResetKey // ✅ 新增：父層控制回第一頁用
}) {
    // ✅ 確保 loadedData 為陣列
    const safeData = Array.isArray(loadedData) ? loadedData : [];
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState([]); // ✅ 勾選狀態
    const rowsPerPage = 15;

    // ✅ 計算分頁資料
    const startIndex = (page - 1) * rowsPerPage;
    const paginatedData = safeData.slice(startIndex, startIndex + rowsPerPage);
    const totalPages = Math.ceil(safeData.length / rowsPerPage);


    const seenDates = new Set();

    // ✅ 是否全選當前頁
    const isAllSelected =
        paginatedData.length > 0 && paginatedData.every((row) => selected.includes(row.pkno));

    // ✅ 切換全選
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const newSelected = Array.from(
                new Set([...selected, ...paginatedData.map((r) => r.pkno)])
            );
            setSelected(newSelected);
            onSelectionChange && onSelectionChange(newSelected);
        } else {
            const remaining = selected.filter(
                (pk) => !paginatedData.some((r) => r.pkno === pk)
            );
            setSelected(remaining);
            onSelectionChange && onSelectionChange(remaining);
        }
    };

    // ✅ 單筆勾選
    const handleSelectOne = (pkno, checked) => {
        const newSelected = checked
            ? [...selected, pkno]
            : selected.filter((id) => id !== pkno);
        setSelected(newSelected);
        onSelectionChange && onSelectionChange(newSelected);
    };

    // ✅ 合計統計
    const summary =
        safeData.length > 0
            ? safeData.reduce(
                (acc, item) => {
                    const amount = Math.round(parseFloat(item.amount) || 0);
                    const overtimePay = Math.round(parseFloat(item.overtimePay) || 0);
                    const taxRate = Math.round(parseFloat(item.tax) || 0);
                    const subtotal = amount + overtimePay;
                    const total = Math.round(subtotal * (1 + taxRate / 100));
                    const taxValue = total - subtotal;

                    // ✅ 只在第一次出現該日期時 +1
                    if (!seenDates.has(item.date)) {
                        seenDates.add(item.date);
                        acc.days += 1;
                    }
                    acc.totalAmount += amount;
                    acc.totalOvertime += overtimePay;
                    acc.totalTax += taxValue;
                    acc.totalFinal += total;
                    return acc;
                },
                { days: 0, totalAmount: 0, totalOvertime: 0, totalTax: 0, totalFinal: 0 }
            )
            : null;

    // ✅ 父層的 resetKey 一變，清空勾選
    React.useEffect(() => {
        setSelected([]);
    }, [resetKey]);

    // ✅ 父層的 pageResetKey 一變 → 回到第一頁
    React.useEffect(() => {
        setPage(1);
    }, [pageResetKey]);

    return (
        <SubCard
            title={
                <Typography
                    variant="h5"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.6rem'
                    }}
                >
                    {title || ''}
                </Typography>
            }
        >
            {/* ✅ 顯示總筆數 / 分頁資訊 */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    px: 1,
                    color: '#555',
                    fontSize: '1.4rem'
                }}
            >
                <span>
                    📊 共 <b>{safeData.length}</b> 筆資料
                    {totalPages > 1 && (
                        <>
                            （每頁 {rowsPerPage} 筆，目前第 <b>{page}</b> / {totalPages} 頁）
                        </>
                    )}
                </span>
            </Box>

            {/* 📋 資料表格 */}
            {safeData.length === 0 ? (
                <p
                    style={{
                        textAlign: 'center',
                        fontSize: '1.4rem',
                        fontWeight: 'bold',
                        color: '#555',
                        margin: '20px 0'
                    }}
                >
                    尚未讀取資料
                </p>
            ) : (
                <>
                    <Table
                        sx={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '1rem', // ✅ 整張表格字放大
                            '& th': {
                                backgroundColor: '#f5f5f5',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                fontSize: '2rem',
                                padding: '8px'
                            },
                            '& td': {
                                textAlign: 'center',
                                padding: '8px'
                            },
                            '& tr:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                            '& tr:hover': { backgroundColor: '#e8f4ff' }
                        }}
                    >
                        <TableHead >
                            <TableRow >
                                {/* ✅ 新增全選 checkbox */}
                                <TableCell >
                                    <Checkbox
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                        📅 日期
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                        🏢 公司
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                        🛠 工具
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                        📍 地點
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                        💬 備註
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                        💰 金額
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                        ⏰ 加班費
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                        🧾 稅金 (%)
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                        💵 含稅總金額
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                        ⚙️ 操作
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {paginatedData.map((item, index) => {
                                const amount = Math.round(parseFloat(item.amount) || 0);
                                const overtimePay = Math.round(parseFloat(item.overtimePay) || 0);
                                const taxRate = Math.round(parseFloat(item.tax) || 0);
                                const subtotal = amount + overtimePay;
                                const total = Math.round(subtotal * (1 + taxRate / 100));
                                const taxValue = total - subtotal;

                                return (
                                    <TableRow key={item.pkno || index}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selected.includes(item.pkno)}
                                                onChange={(e) =>
                                                    handleSelectOne(item.pkno, e.target.checked)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>{item.date || '—'}</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>{item.company || '—'}</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>{item.tool || '—'}</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>{item.location || '—'}</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>{item.note || '—'}</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>{amount.toLocaleString()}</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>{overtimePay.toLocaleString()}</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                            {taxRate}%<br />
                                            <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                                                +{taxValue.toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: { xs: '1.2rem', sm: '1.4rem' } }}>
                                            {total.toLocaleString()}
                                            <br />
                                            <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                                                = {subtotal.toLocaleString()} + {taxValue.toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                {/* 編輯按鈕 */}
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        color: '#fff',
                                                        backgroundColor: '#507ce4ff',
                                                        borderColor: '#4171e2',
                                                        boxShadow: 'none',
                                                        '&:hover': {
                                                            backgroundColor: '#3358d4',
                                                            boxShadow: '0 0 6px rgba(65,113,226,0.4)',
                                                        },
                                                    }}
                                                    onClick={() => onEdit(item)}
                                                >
                                                    ✏️ 編輯
                                                </Button>

                                                {/* 刪除按鈕 */}
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    fontSize="medium"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        color: '#d32f2f',
                                                        borderColor: '#d32f2f',
                                                        '&:hover': {
                                                            backgroundColor: '#e17a67',
                                                            color: '#fff',
                                                            borderColor: '#e17a67',
                                                            boxShadow: '0 0 6px rgba(225,122,103,0.4)',
                                                        },
                                                    }}
                                                    onClick={() => onDelete([item.pkno])}
                                                >
                                                    🗑️ 刪除
                                                </Button>
                                            </Stack>
                                        </TableCell>

                                    </TableRow>
                                );
                            })}

                            {/* ✅ 合計列 */}
                            {summary && (
                                <TableRow
                                    sx={{
                                        backgroundColor: '#e3f2fd',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.2rem' } }}>📊 合計</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.2rem' } }}>{summary.days} 天</TableCell>
                                    <TableCell colSpan={4}>—</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                        {summary.totalAmount.toLocaleString()}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                        {summary.totalOvertime.toLocaleString()}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                        {summary.totalTax.toLocaleString()}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                        {summary.totalFinal.toLocaleString()}
                                    </TableCell>
                                    <TableCell />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* ✅ 分頁控制 */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                color="primary"
                                size="large"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        color="error"
                        disabled={selected.length === 0}
                        onClick={() => onDelete(selected)}
                        sx={{
                            fontWeight: 'bold',
                            color: '#f7f7f7ff',
                            backgroundColor: '#f94343ff',
                            borderColor: '#d32f2f',
                            '&:hover': {
                                backgroundColor: '#c01818f9',
                                color: '#ffffffff',
                                borderColor: '#e17a67',
                                boxShadow: '0 0 6px rgba(225,122,103,0.4)',
                            },
                            mt: 2,
                            fontSize: { xs: '1rem', sm: '1.2rem' }
                        }}
                    >
                        🗑️ 批次刪除 ({selected.length})
                    </Button>
                </>
            )}
        </SubCard>
    );
}
