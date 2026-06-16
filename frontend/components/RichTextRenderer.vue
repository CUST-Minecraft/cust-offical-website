<template>
  <div class="rich-text" v-html="contentHtml"></div>
</template>

<script setup lang="ts">
const props = defineProps<{ content: string }>()

const contentHtml = computed(() => renderMarkdownLikeText(props.content))

function renderMarkdownLikeText(value: string) {
  const lines = value.replace(/\r\n/g, '\n').split('\n')
  const blocks: string[] = []
  let listItems: string[] = []
  let paragraph: string[] = []

  function flushParagraph() {
    if (paragraph.length) {
      blocks.push(`<p>${formatInline(paragraph.join(' '))}</p>`)
      paragraph = []
    }
  }

  function flushList() {
    if (listItems.length) {
      blocks.push(`<ul>${listItems.map((item) => `<li>${formatInline(item)}</li>`).join('')}</ul>`)
      listItems = []
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line) {
      flushParagraph()
      flushList()
      continue
    }

    const heading = line.match(/^(#{2,3})\s+(.+)$/)
    if (heading) {
      flushParagraph()
      flushList()
      const level = heading[1].length
      blocks.push(`<h${level}>${formatInline(heading[2])}</h${level}>`)
      continue
    }

    const list = line.match(/^[-*]\s+(.+)$/)
    if (list) {
      flushParagraph()
      listItems.push(list[1])
      continue
    }

    flushList()
    paragraph.push(line)
  }

  flushParagraph()
  flushList()

  return blocks.join('')
}

function formatInline(value: string) {
  const linkPattern = /\[(.+?)\]\((https?:\/\/[^)\s]+)\)/g
  let html = ''
  let lastIndex = 0

  for (const match of value.matchAll(linkPattern)) {
    const [source, label, href] = match
    const index = match.index ?? 0

    html += formatStrong(escapeHtml(value.slice(lastIndex, index)))

    const safeHref = safeHttpUrl(href)
    html += safeHref
      ? `<a href="${escapeHtml(safeHref)}" target="_blank" rel="noopener noreferrer">${formatStrong(escapeHtml(label))}</a>`
      : formatStrong(escapeHtml(source))

    lastIndex = index + source.length
  }

  html += formatStrong(escapeHtml(value.slice(lastIndex)))

  return html
}

function formatStrong(value: string) {
  return value.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

function safeHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : ''
  } catch {
    return ''
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
</script>
