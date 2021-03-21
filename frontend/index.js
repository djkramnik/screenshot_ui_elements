
const maxPage =  50
const pathname = window.location.pathname
const category = window.location.pathname.split('/')[1]
let page = parseInt(getPage(window.location.search), 10)
if (Number.isNaN(page) || !page) {
  page = 0
}

if (!category) {
  doRootPage()
} else {
  doCategoryPage(category)
}

async function doRootPage() {
  const response = await fetch('/api/categories')
  const data = await response.json()
  populateCategories(data.categories)
}

async function doCategoryPage(category) {
  let response = null
  try {
    response = await fetch(`/api/categories/${category}`)
  } catch(e) {
    alert('category not found')
    return
  }
  const data = await response.json()
  populateImages(data.files)
}

function populateCategories(categories) {
  const fragment = new DocumentFragment()
  categories.forEach(category => {
    const item = document.createElement('li')
    const anchor = document.createElement('a')
    anchor.href = `/${category}`
    anchor.innerHTML = category
    item.appendChild(anchor)
    fragment.appendChild(item)
  })

  const listContainer = document.getElementById('items')
  listContainer.appendChild(fragment)
}

function createImageViewer(src) {
  const item = document.createElement('li')
  const imgBox = document.createElement('div')
  imgBox.style = 'max-width:30vw;padding:10px;background-color:#333;'
  const img = document.createElement('img')
  img.style = `width:100%`
  img.src = src
  const btn = document.createElement('button')
  btn.innerText = 'del'
  imgBox.appendChild(img)
  imgBox.appendChild(btn)
  item.appendChild(imgBox)
  return item
}

function populateImages(files) {
  const startIndex = page * maxPage
  const paginatedFiles = files.slice(startIndex, startIndex + maxPage)
  const fragment = new DocumentFragment()

  paginatedFiles.forEach(file => {
    fragment.appendChild(createImageViewer(`/img/${category}/${file}`))
  })
  
  const listContainer = document.getElementById('items')
  listContainer.style = 'display:flex;flex-wrap:wrap;max-width:1000px'
  listContainer.appendChild(fragment)
  listContainer.addEventListener('click', async (event) => {
    if (event.target.tagName.toLowerCase() !== 'button') {
      return
    }
    const imgBox = event.target.parentNode
    const [category, file] = imgBox.querySelector('img').src.split('/').slice(-2)
    try {
      await fetch(`/api/categories/${category}/${file}`, { method: 'DELETE' })
      imgBox.parentNode.remove()
    } catch(e) {
      alert('that didnt work you know')
    }
  }) 

  const sidebar = document.getElementById('sidebar')
  sidebar.style.display = 'block'
  document.getElementById('prev').addEventListener('click', () => {
    if (page === 0) {
      return
    }
    window.location.href = window.location.href.replace(/\?.*/g, '') + `?page=${Math.max(page - 1, 0)}`
  })
  document.getElementById('next').addEventListener('click', () => {
    window.location.href = window.location.href.replace(/\?.*/g, '') + `?page=${page + 1}`
  })
  document.getElementById('home').addEventListener('click', () => {
    window.location.href = '/'
  })
}

function getPage(query) {
  const pageParam = query.match(/([^?&])+=([^?&])+/)?.filter(str => str.indexOf('page=') === 0)
  if (!pageParam?.length) {
    return 
  }
  return pageParam[0].split('=')[1]
}

