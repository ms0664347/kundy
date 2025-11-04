import PropTypes from 'prop-types';
import { forwardRef, useState, useEffect } from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import { Box, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useTheme } from '@mui/material/styles';

// third party
import { bindToggle } from 'material-ui-popup-state';

// project imports

// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons-react';

import { motion, AnimatePresence } from 'framer-motion';

import { solarToLunar } from 'chinese-lunar';
import dayjs from 'dayjs';

function HeaderAvatarComponent({ children, ...others }, ref) {

    const theme = useTheme();
    return (
        <Avatar
            ref={ref}
            variant="rounded"
            sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                bgcolor: 'secondary.light',
                color: 'secondary.dark',
                '&:hover': {
                    bgcolor: 'secondary.dark',
                    color: 'secondary.light'
                }
            }}
            {...others}
        >
            {children}
        </Avatar>
    );
}

const HeaderAvatar = forwardRef(HeaderAvatarComponent);

// ==============================|| SEARCH INPUT - MOBILE||============================== //

function MobileSearch({ value, setValue, popupState }) {
    const theme = useTheme();

    return (
        <OutlinedInput
            id="input-search-header"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search"
            startAdornment={
                <InputAdornment position="start">
                    <IconSearch stroke={1.5} size="16px" />
                </InputAdornment>
            }
            endAdornment={
                <InputAdornment position="end">
                    <HeaderAvatar>
                        <IconAdjustmentsHorizontal stroke={1.5} size="20px" />
                    </HeaderAvatar>
                    <Box sx={{ ml: 2 }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                bgcolor: 'orange.light',
                                color: 'orange.dark',
                                '&:hover': {
                                    bgcolor: 'orange.dark',
                                    color: 'orange.light'
                                }
                            }}
                            {...bindToggle(popupState)}
                        >
                            <IconX stroke={1.5} size="20px" />
                        </Avatar>
                    </Box>
                </InputAdornment>
            }
            aria-describedby="search-helper-text"
            inputProps={{ 'aria-label': 'weight', sx: { bgcolor: 'transparent', pl: 0.5 } }}
            sx={{ width: '100%', ml: 0.5, px: 2, bgcolor: 'background.paper' }}
        />
    );
}

// ==============================|| SEARCH INPUT ||============================== //

export default function SearchSection() {

    const [value, setValue] = useState('');
    const texts = [
        'Hi Kundy 你好😊',
        '今天是個適合開工的好日子 🚜',
        '工作注意安全，多喝水💧',
        '爸爸你上班辛苦了 💪',
        '時間不早了，早點休息😎'
    ];

    const [index, setIndex] = useState(0);
    const [festival, setFestival] = useState('');
    const [lunarText, setLunarText] = useState('');

    useEffect(() => {
        const today = new Date();
        const solarMonth = today.getMonth() + 1;
        const solarDay = today.getDate();

        // ✅ 取得農曆日期
        const lunar = solarToLunar(today);
        setLunarText(`農曆 ${lunar.month} 月 ${lunar.day} 日`);

        // ✅ 國曆節日
        const nationalFestivals = {
            '1-1': '🎉 元旦快樂！',
            '2-28': '🇹🇼 和平紀念日',
            '10-10': '🇹🇼 雙十國慶快樂！',
            '12-25': '🎄 聖誕節快樂！'
        };

        // ✅ 農曆節日
        const lunarFestivals = {
            '1-1': '🎆 新年快樂！',
            '5-5': '🐉 端午節快樂！',
            '7-7': '💞 七夕快樂！',
            '8-8': '🎉 父親節快樂！',
            '8-15': '🏮 中秋節快樂！'
        };

        const solarKey = `${solarMonth}-${solarDay}`;
        const lunarKey = `${lunar.month}-${lunar.day}`;

        if (nationalFestivals[solarKey]) {
            setFestival(nationalFestivals[solarKey]);
        } else if (lunarFestivals[lunarKey]) {
            setFestival(lunarFestivals[lunarKey]);
        } else {
            setFestival('');
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length);
        }, 3000); // 每 3 秒切換一次
        return () => clearInterval(timer);
    }, [texts.length]);

    return (
        <>
            {/* <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <PopupState variant="popper" popupId="demo-popup-popper">
                    {(popupState) => (
                        <>
                            <Box sx={{ ml: 2 }}>
                                <HeaderAvatar {...bindToggle(popupState)}>
                                    <IconSearch stroke={1.5} size="19.2px" />
                                </HeaderAvatar>
                            </Box>
                            <Popper
                                {...bindPopper(popupState)}
                                transition
                                sx={{ zIndex: 1100, width: '99%', top: '-55px !important', px: { xs: 1.25, sm: 1.5 } }}
                            >
                                {({ TransitionProps }) => (
                                    <>
                                        <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                                            <Card sx={{ bgcolor: 'background.default', border: 0, boxShadow: 'none' }}>
                                                <Box sx={{ p: 2 }}>
                                                    <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Grid size="grow">
                                                            <MobileSearch value={value} setValue={setValue} popupState={popupState} />
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Card>
                                        </Transitions>
                                    </>
                                )}
                            </Popper>
                        </>
                    )}
                </PopupState>
            </Box> */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    p: 2,
                    width: '50%',
                    ml: '10%',
                    height: '70px',
                    overflow: 'hidden', // 讓動畫只顯示範圍內
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -40, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ position: 'absolute' }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                fontSize: '1.2rem',
                                textAlign: 'center',
                            }}
                        >
                            {texts[index]}
                        </Typography>
                    </motion.div>
                </AnimatePresence>

                {/* 節慶訊息 */}
                {festival && (
                    <Typography
                        variant="subtitle1"
                        sx={{
                            mt: 5,
                            color: '#d32f2f',
                            fontWeight: 'bold',
                            animation: 'blink 1s infinite',
                            '@keyframes blink': {
                                '0%, 100%': { opacity: 1 },
                                '50%': { opacity: 0.3 }
                            }
                        }}
                    >
                        {festival}
                    </Typography>
                )}

                <Typography
                    variant="caption"
                    sx={{
                        mt: 1,
                        color: '#777',
                        textAlign: 'right', // 👈 靠右
                        width: '100%',      // 👈 讓靠右有效果
                        pr: 2,               // 👈 稍微右移一些距離
                        ml: 2
                    }}
                >
                    {lunarText}
                </Typography>

            </Box>
        </>
    );
}

HeaderAvatarComponent.propTypes = { children: PropTypes.node, others: PropTypes.any };

MobileSearch.propTypes = { value: PropTypes.string, setValue: PropTypes.func, popupState: PropTypes.any };
