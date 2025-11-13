import PropTypes from 'prop-types';
import React from 'react';
// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { IconBusinessplan } from '@tabler/icons-react';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${ theme.palette.warning.dark } -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${ theme.palette.warning.dark } -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

export default function TotalIncomeLightCard({ isLoading, topCompany, currentYear }) {
    const theme = useTheme();
    const [mode, setMode] = React.useState('income'); // 預設顯示收入

    // 根據 mode 切換顯示內容
    const labelText = mode === 'income' ? '收入' : '支出';
    const color = mode === 'income' ? '#55f458ff' : '#fac472ff';
    const name = mode === 'income' ? (topCompany?.name || '—') : (topExpense?.category || '—');
    const value = mode === 'income'
        ? `${ topCompany?.count?.toLocaleString?.() || 0 } 次`
        : `$${ topExpense?.total?.toLocaleString?.() || 0 }`;

    return (
        <>
            {isLoading ? (
                <TotalIncomeCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Grid container direction="column">
                        <Box
                            sx={{
                                p: 2,
                                display: 'flex',           // ✅ 同一排
                                alignItems: 'center',      // ✅ 垂直置中
                                justifyContent: 'space-between',
                                gap: 2                     // ✅ 圖示與文字間距
                            }}
                        >
                            {/* 左側：圖示 + 標題 */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <IconBusinessplan
                                    sx={{
                                        color: '#7d7575ff',
                                        fontSize: '1.6rem',
                                        verticalAlign: 'middle'
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: '1rem',   // 小尺寸（手機）
                                            md: '1.25rem', // 中尺寸（平板）
                                            lg: '1.5rem'   // 大尺寸（桌機）
                                        },
                                        fontWeight: 500,
                                        color: '#100f0fff'
                                    }}
                                >
                                    今年 ({currentYear}年)收入最高公司
                                </Typography>
                            </Box>

                            {/* 右上角切換按鈕 */}
                            <ToggleButtonGroup
                                color="primary"
                                exclusive
                                value={mode}
                                onChange={(e, newMode) => {
                                    if (newMode !== null) setMode(newMode);
                                }}
                                sx={{
                                    backgroundColor: 'rgba(47, 239, 230, 0.1)',
                                    borderRadius: 2,
                                    '& .MuiToggleButton-root': {
                                        color: '#2e3ef7ff',
                                        border: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        px: 2,
                                        '&.Mui-selected': {
                                            backgroundColor: '#94f53982',
                                            color: '#2e3ef7ff'
                                        },
                                        '&:hover': {
                                            backgroundColor: '#85cd1133'
                                        }
                                    }
                                }}
                            >
                                <ToggleButton value="income">收入</ToggleButton>
                                <ToggleButton value="expense">支出</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        {/* 內容區塊 */}
                        <Box
                            key={mode}
                            sx={{
                                p: 2,
                                color: '#fff',
                                animation: 'fadeInScale 0.5s ease forwards',
                                '@keyframes fadeInScale': {
                                    '0%': { opacity: 0, transform: 'scale(0.95)' },
                                    '100%': { opacity: 1, transform: 'scale(1)' }
                                },
                                display: 'flex',           // ✅ 同一行排列
                                alignItems: 'baseline',    // ✅ 對齊底線（讓字漂亮對齊）
                                gap: 1,                     // ✅ 兩者間距
                                mt: 0,
                                ml: 4
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '1.8rem',
                                    fontWeight: 600,
                                    color: '#ae00ffff'
                                }}
                            >
                                {name}
                            </Typography>
                            <Typography
                                component="span"
                                sx={{
                                    fontSize: '1.25rem',
                                    color: '#443b3bff',
                                    fontWeight: 400,
                                    ml: 1
                                }}
                            >
                                ({value})
                            </Typography>

                        </Box>
                    </Grid>
                </CardWrapper>
            )}
        </>
    );
}

TotalIncomeLightCard.propTypes = { isLoading: PropTypes.bool, total: PropTypes.number, icon: PropTypes.node, label: PropTypes.string };
