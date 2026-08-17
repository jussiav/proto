import { createApp, h } from 'vue'
import NavUserIcon from './components/NavUserIcon.vue'

function replace(id, color) {
  const img = document.getElementById(id)
  if (!img) return
  const mount = document.createElement('span')
  mount.style.display = 'contents'
  img.parentNode.insertBefore(mount, img)
  img.style.display = 'none'
  createApp({ render: () => h(NavUserIcon, { color, size: '24px' }) }).mount(mount)
}

replace('nav-login-icon',       'white')
replace('nav-login-icon-white', '#0B6DFF')
