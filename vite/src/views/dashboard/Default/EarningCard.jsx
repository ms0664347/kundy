import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets

export default function EarningCard({ isLoading, monthIncome, monthWorkDays, totalDaysInMonth, currentMonth }) {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <MainCard
                    border={false}
                    content={false}
                    aria-hidden={Boolean(anchorEl)}
                    sx={{
                        bgcolor: 'secondary.dark',
                        color: '#fff',
                        overflow: 'hidden',
                        position: 'relative',
                        height: '100%',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: 150,
                            height: 150,
                            background: theme.palette.secondary[800],
                            borderRadius: '50%',
                            top: { xs: -85 },
                            right: { xs: -95 }
                        },
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: theme.palette.secondary[800],
                            borderRadius: '50%',
                            top: { xs: -125 },
                            right: { xs: -15 },
                            opacity: 0.5
                        }
                    }}
                >
                    <Box
                        sx={{
                            p: 2.25,
                            [theme.breakpoints.up('lg')]: {
                                mt: 1, // 整體往下移
                                p: 3.5
                            }
                        }}
                    >
                        <Grid container direction="column">
                            <Box
                                mb={2}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    [theme.breakpoints.up('lg')]: {
                                        mb: 3 // 標題與內容間距變大
                                    }
                                }}
                            >
                                <CalendarMonthTwoToneIcon sx={{
                                    color: '#fff',
                                    fontSize: '1.6rem',
                                    [theme.breakpoints.up('lg')]: {
                                        fontSize: '3rem' // 大螢幕放大圖示
                                    }
                                }} />
                                <Typography
                                    sx={{
                                        fontSize: '1.125rem',
                                        fontWeight: 500,
                                        color: '#fff',
                                        [theme.breakpoints.up('lg')]: {
                                            fontSize: '1.5rem' // 大螢幕放大文字
                                        }
                                    }}
                                >
                                    本月 ({currentMonth}月)
                                </Typography>
                            </Box>
                            <Grid>
                                <Grid
                                    container
                                    direction="column"
                                    sx={{
                                        mt: 1,
                                        gap: 0.5,
                                        [theme.breakpoints.up('lg')]: {
                                            mt: 2, // 間距加大
                                            gap: 1
                                        }
                                    }}
                                >
                                    {/* 收入金額 */}
                                    <Grid>
                                        <Typography
                                            sx={{
                                                fontSize: '1.6rem',
                                                fontWeight: 600,
                                                color: '#fff',
                                                [theme.breakpoints.up('lg')]: {
                                                    fontSize: '2rem'
                                                }
                                            }}
                                        >
                                            收入：${monthIncome?.toLocaleString() || '0.00'}
                                        </Typography>
                                    </Grid>

                                    {/* 工作天數區塊 */}
                                    <Grid>
                                        <Typography
                                            sx={{
                                                fontSize: '1.4rem',
                                                color: '#e0e0e0',
                                                fontWeight: 400,
                                                [theme.breakpoints.up('lg')]: {
                                                    fontSize: '1.6rem'
                                                }
                                            }}
                                        >
                                            ({monthWorkDays}/{totalDaysInMonth} 天)
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </MainCard>
            )}
        </>
    );
}

EarningCard.propTypes = {
    isLoading: PropTypes.bool,
    monthIncome: PropTypes.number
};

