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

    const texts = [
        'Welcome to Kundy!😊',
        'Hi! Kundy 你好😊',
        '工作注意安全，不疲勞駕駛🚗',
        '今天是個適合上班的好日子 🚜',
        '沒事多喝水，多喝水沒事💧',
        '爸爸你上班辛苦了 💪',
        '時間不早了，早點休息😎'
    ];

    const [index, setIndex] = useState(0);




    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length);
        }, 3000); // 每 3 秒切換一次
        return () => clearInterval(timer);
    }, [texts.length]);

    return (
        <>
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
                    position: 'relative',
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


            </Box>
        </>
    );
}

HeaderAvatarComponent.propTypes = { children: PropTypes.node, others: PropTypes.any };

MobileSearch.propTypes = { value: PropTypes.string, setValue: PropTypes.func, popupState: PropTypes.any };
