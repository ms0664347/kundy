import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TimelineTwoToneIcon from '@mui/icons-material/TimelineTwoTone';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

export default function TotalOrderLineChartCard({ isLoading, yearIncome, yearWorkDays, currentYear }) {
    const theme = useTheme();

    return (
        <>
            {isLoading ? (
                <SkeletonTotalOrderCard />
            ) : (
                <MainCard
                    border={false}
                    content={false}
                    sx={{
                        bgcolor: 'primary.dark',
                        color: '#fff',
                        overflow: 'hidden',
                        position: 'relative',
                        height: '100%',
                        '&>div': {
                            position: 'relative',
                            zIndex: 5
                        },
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: 150,
                            height: 150,
                            background: theme.palette.primary[800],
                            borderRadius: '50%',
                            top: { xs: -85 },
                            right: { xs: -95 }
                        },
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: theme.palette.primary[800],
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
                            {/* 標題區塊 */}
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
                                <TimelineTwoToneIcon
                                    sx={{
                                        color: '#fff',
                                        fontSize: '1.6rem',
                                        [theme.breakpoints.up('lg')]: {
                                            fontSize: '3rem' // 大螢幕放大圖示
                                        }
                                    }}
                                />
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
                                    今年 ({currentYear}年)
                                </Typography>
                            </Box>

                            {/* 收入與天數 */}
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
                                            收入：${yearIncome?.toLocaleString() || '0.00'}
                                        </Typography>
                                    </Grid>

                                    {/* 工作天數 */}
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
                                            ({yearWorkDays}/365天)
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

TotalOrderLineChartCard.propTypes = { isLoading: PropTypes.bool };
