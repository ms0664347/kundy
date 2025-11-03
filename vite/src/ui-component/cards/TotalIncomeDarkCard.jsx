import PropTypes from 'prop-types';
// material-ui
import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import BuildCircleTwoToneIcon from '@mui/icons-material/BuildCircleTwoTone';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${ theme.palette.primary[200] } -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${ theme.palette.primary[200] } -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

export default function TotalIncomeDarkCard({ isLoading, topTool, currentMonth }) {
    const theme = useTheme();

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
                                gap: 2                     // ✅ 圖示與文字間距
                            }}
                        >
                            <BuildCircleTwoToneIcon
                                sx={{
                                    color: '#fff',
                                    fontSize: '1.6rem',
                                    verticalAlign: 'middle'
                                }}
                            />
                            <Typography
                                sx={{
                                    fontSize: '1.125rem',
                                    fontWeight: 500,
                                    color: '#fff'
                                }}
                            >
                                本月({currentMonth}月)使用最多工具
                            </Typography>
                        </Box>
                        <Box sx={{ p: 2, gap: 2 }} >
                            <Typography
                                sx={{
                                    fontSize: '1.6rem',
                                    fontWeight: 600,
                                    color: '#fff'
                                }}
                            >
                                {topTool.name}
                                <Typography
                                    component="span"
                                    sx={{
                                        fontSize: '1.25rem',
                                        color: '#d0d0d0',
                                        fontWeight: 400,
                                        ml: 1
                                    }}
                                >
                                    ({topTool.count} 次)
                                </Typography>
                            </Typography>
                        </Box>
                    </Grid>
                </CardWrapper>
            )}
        </>
    );
}

TotalIncomeDarkCard.propTypes = { isLoading: PropTypes.bool };
