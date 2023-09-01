/* eslint-disable no-undef */
const theme = localStorage.getItem('theme') || 'light'
const element = document.querySelector('.dark-mode-switch')
if (theme === 'dark') {
  element.click()
} else {
  document.body.classList.add(theme)
}

const observer = new MutationObserver(() => {
  if (!element.classList.contains('dark')) {
    document.body.classList.add('light')
    localStorage.setItem('theme', 'light')
  } else {
    document.body.classList.remove('light')
    localStorage.setItem('theme', 'dark')
  }
})

observer.observe(element, {
  attributes: true, 
  attributeFilter: ['class'],
  childList: false, 
  characterData: false
})

// /js/customize-theme.js