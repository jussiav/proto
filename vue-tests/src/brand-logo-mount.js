import { createApp, h } from 'vue'
import ABrandLogo from './components/ABrandLogo.vue'

function replace(id, props) {
  const img = document.getElementById(id)
  if (!img) return
  const mount = document.createElement('span')
  mount.style.display = 'contents'
  img.parentNode.insertBefore(mount, img)
  img.style.display = 'none'
  createApp({ render: () => h(ABrandLogo, props) }).mount(mount)
}

replace('nav-logo',       { inverted: true,  width: 107, height: 22 })
replace('nav-logo-white', { inverted: false, width: 107, height: 22 })
replace('footer-logo',    { inverted: true,  fullWidth: true })
