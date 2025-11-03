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
    Pagination
} from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';

export default function WorkReportTable({ title = '', loadedData = [], onEdit, onDelete }) {
    // ✅ 確保 loadedData 為陣列
    const safeData = Array.isArray(loadedData) ? loadedData : [];
    const [page, setPage] = useState(1);
    const rowsPerPage = 15;

    // ✅ 計算分頁資料
    const startIndex = (page - 1) * rowsPerPage;
    const paginatedData = safeData.slice(startIndex, startIndex + rowsPerPage);
    const totalPages = Math.ceil(safeData.length / rowsPerPage);


    const seenDates = new Set();
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
                    fontSize: '1rem'
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
                            '& th': {
                                backgroundColor: '#f5f5f5',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                fontSize: '1.2rem',
                                padding: '12px'
                            },
                            '& td': {
                                textAlign: 'center',
                                padding: '8px'
                            },
                            '& tr:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                            '& tr:hover': { backgroundColor: '#e8f4ff' }
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>-</TableCell>
                                <TableCell>📅 日期</TableCell>
                                <TableCell>🏢 公司</TableCell>
                                <TableCell>🛠 工具</TableCell>
                                <TableCell>📍 地點</TableCell>
                                <TableCell>💬 備註</TableCell>
                                <TableCell>💰 金額</TableCell>
                                <TableCell>⏰ 加班費</TableCell>
                                <TableCell>🧾 稅金 (%)</TableCell>
                                <TableCell>💵 含稅總金額</TableCell>
                                <TableCell>⚙️ 操作</TableCell>
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
                                        <TableCell>-</TableCell>
                                        <TableCell>{item.date || '—'}</TableCell>
                                        <TableCell>{item.company || '—'}</TableCell>
                                        <TableCell>{item.tool || '—'}</TableCell>
                                        <TableCell>{item.location || '—'}</TableCell>
                                        <TableCell>{item.note || '—'}</TableCell>
                                        <TableCell>{amount.toLocaleString()}</TableCell>
                                        <TableCell>{overtimePay.toLocaleString()}</TableCell>
                                        <TableCell>
                                            {taxRate}%<br />
                                            <Typography variant="caption" color="textSecondary">
                                                +{taxValue.toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                            {total.toLocaleString()}
                                            <br />
                                            <Typography variant="caption" color="textSecondary">
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
                                                    onClick={() => onDelete(item)}
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
                                    <TableCell sx={{ fontWeight: 'bold' }}>📊 合計</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{summary.days} 天</TableCell>
                                    <TableCell colSpan={4}>—</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        {summary.totalAmount.toLocaleString()}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        {summary.totalOvertime.toLocaleString()}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        {summary.totalTax.toLocaleString()}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>
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
                </>
            )}
        </SubCard>
    );
}
