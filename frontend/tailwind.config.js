/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 主色调 - SolAPI 品牌橙（SolYoung 深橙系）
        primary: {
          50: '#FBF4EC',
          100: '#F6E3D0',
          200: '#EDC6A4',
          300: '#E3A878',
          400: '#DE8555',
          500: '#D96A36',
          600: '#C2572B',
          700: '#A94725',
          800: '#8A3B1F',
          900: '#6E3019',
          950: '#3E1A0D'
        },
        // 辅助色 - 暖中性灰
        accent: {
          50: '#FAF9F7',
          100: '#F3F1EC',
          200: '#E8E4DC',
          300: '#D6D1C7',
          400: '#B0A99C',
          500: '#8F8779',
          600: '#716A5E',
          700: '#5A544A',
          800: '#3F3B33',
          900: '#2B2823',
          950: '#1B1915'
        },
        // 深色模式背景（暖黑）
        dark: {
          50: '#F7F5F1',
          100: '#EFECE5',
          200: '#E1DCD2',
          300: '#C8C1B6',
          400: '#9C948A',
          500: '#766E64',
          600: '#575148',
          700: '#3E3A33',
          800: '#2B2823',
          900: '#211F1B',
          950: '#16140F'
        }
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif'
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        glass: '0 8px 32px rgba(60, 42, 28, 0.08)',
        'glass-sm': '0 4px 16px rgba(60, 42, 28, 0.06)',
        glow: '0 0 20px rgba(217, 106, 54, 0.20)',
        'glow-lg': '0 0 40px rgba(217, 106, 54, 0.28)',
        card: '0 1px 2px rgba(43, 40, 35, 0.05), 0 1px 3px rgba(43, 40, 35, 0.04)',
        'card-hover': '0 12px 32px rgba(60, 42, 28, 0.10)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.6)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #D96A36 0%, #A94725 100%)',
        'gradient-dark': 'linear-gradient(135deg, #2B2823 0%, #1B1915 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 100%)',
        'mesh-gradient':
          'radial-gradient(at 35% 20%, rgba(217, 106, 54, 0.10) 0px, transparent 55%), radial-gradient(at 80% 0%, rgba(169, 71, 37, 0.06) 0px, transparent 50%), radial-gradient(at 5% 65%, rgba(217, 106, 54, 0.07) 0px, transparent 55%)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        glow: {
          '0%': { boxShadow: '0 0 16px rgba(217, 106, 54, 0.18)' },
          '100%': { boxShadow: '0 0 28px rgba(217, 106, 54, 0.30)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
}
