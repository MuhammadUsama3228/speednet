import { ThemeProvider } from '../context/ThemeContext';
import { LazyMotion, domMax } from 'framer-motion';

export default function ClientProviders({ children }) {
    return (
        <LazyMotion features={domMax}>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </LazyMotion>
    );
}
