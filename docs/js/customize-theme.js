/* eslint-disable no-undef */
const theme = localStorage.getItem('theme') || 'light'
const element = document.querySelector('.dark-mode-switch')
const html = document.getElementsByTagName('html')[0]
if (theme === 'dark') {
  element.click()
} else {
  html.classList.add(theme)
  document.body.classList.add(theme)
}

const observer = new MutationObserver(() => {
  const html = document.getElementsByTagName('html')[0]
  if (!element.classList.contains('dark')) {
    html.classList.add('light')
    document.body.classList.add('light')
    localStorage.setItem('theme', 'light')
    
  } else {
    html.classList.remove('light')
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