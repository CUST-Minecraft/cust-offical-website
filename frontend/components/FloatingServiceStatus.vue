<template>
  <div class="floating-service-status">
    <button
      class="floating-dock-summary"
      type="button"
      :aria-label="`打开快捷工具，${toolCount} 项入口`"
      title="打开快捷工具"
      @click="openWorkbench"
    >
      <span class="allay-agent-icon is-compact" aria-hidden="true">
        <img src="/example-assets/allay-agent-cute.png" alt="">
      </span>
      <span class="floating-dock-copy">
        <strong>快捷工具</strong>
        <small>{{ toolCount }} 项入口</small>
      </span>
      <span class="floating-dock-chevron" aria-hidden="true">▴</span>
    </button>

    <Transition name="quick-tools">
      <div
        v-if="isWorkbenchOpen"
        class="quick-tools-backdrop"
        role="presentation"
        @click.self="closeWorkbench"
      >
        <section
          class="quick-tools-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-tools-title"
        >
          <header class="quick-tools-header">
            <span>
              <strong id="quick-tools-title">快捷工具</strong>
              <small>Quick Tools Workbench</small>
            </span>
            <button class="quick-tools-close" type="button" aria-label="关闭快捷工具" title="关闭" @click="closeWorkbench">
              X
            </button>
          </header>

          <div class="quick-tools-body">
            <nav class="quick-tools-list" aria-label="快捷工具列表">
              <span class="quick-tools-group-label">外部入口</span>
              <button
                v-for="tool in externalTools"
                :key="tool.id"
                class="quick-tool-item"
                :class="toolItemClass(tool)"
                type="button"
                :aria-pressed="activeTool === tool.id"
                @click="selectTool(tool.id)"
              >
                <span class="quick-tool-icon" aria-hidden="true">
                  <img v-if="tool.icon === 'docs'" class="docs-shelf-icon" src="/example-assets/bookshelf-docs.svg" alt="">
                </span>
                <span class="quick-tool-name">{{ tool.label }}</span>
                <small>{{ tool.badge }}</small>
              </button>

              <span class="quick-tools-group-label">站内工具</span>
              <button
                v-for="tool in internalTools"
                :key="tool.id"
                class="quick-tool-item"
                :class="toolItemClass(tool)"
                type="button"
                :aria-pressed="activeTool === tool.id"
                @click="selectTool(tool.id)"
              >
                <span class="quick-tool-icon" aria-hidden="true">
                  <span v-if="tool.icon === 'agent'" class="allay-agent-icon is-tool">
                    <img src="/example-assets/allay-agent-cute.png" alt="">
                  </span>
                  <img v-else class="status-lamp" src="/example-assets/service-redstone-lamp.svg" alt="">
                </span>
                <span class="quick-tool-name">{{ tool.label }}</span>
                <small>{{ tool.badge }}</small>
              </button>
            </nav>

            <div class="quick-tools-stage">
              <section v-if="activeTool === 'docs'" class="quick-tool-pane is-external">
                <div class="quick-tool-pane-heading">
                  <img class="docs-shelf-icon is-large" src="/example-assets/bookshelf-docs.svg" alt="" aria-hidden="true">
                  <span>
                    <strong>文档中心</strong>
                    <small>{{ documentCenterUrl ? '外部系统 / 新标签页打开' : '外部系统 / 未配置' }}</small>
                  </span>
                </div>
                <p>文档中心由独立系统处理账号、权限、文档编辑和访问控制。官网只提供公开跳转入口。</p>
                <a
                  v-if="documentCenterUrl"
                  class="quick-tool-primary"
                  :href="documentCenterUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  打开文档中心 ↗
                </a>
                <button v-else class="quick-tool-primary is-disabled" type="button" disabled>
                  文档中心未配置
                </button>
              </section>

              <section v-else-if="activeTool === 'agent'" class="quick-tool-pane is-agent">
                <div class="quick-tool-pane-heading">
                  <span class="allay-agent-icon is-pane" aria-hidden="true">
                    <img src="/example-assets/allay-agent-cute.png" alt="">
                  </span>
                  <span>
                    <strong>悦灵助手</strong>
                    <small>站内工具 / {{ agentStatusLabel }}</small>
                  </span>
                </div>
                <section v-if="agentStatus === 'checking'" class="quick-agent-state">
                  <span class="agent-scan-icon" aria-hidden="true">
                    <img src="/example-assets/allay-agent-cute.png" alt="">
                  </span>
                  <strong>正在连接 Agent 服务</strong>
                  <p>悦灵正在确认对话服务状态。</p>
                  <span class="agent-scan-bar" aria-hidden="true"></span>
                </section>

                <section v-else-if="agentStatus === 'offline'" class="quick-agent-state">
                  <span class="agent-offline-rune" aria-hidden="true"></span>
                  <strong>悦灵助手暂时离线</strong>
                  <p>{{ agentStatusMessage || 'Agent 服务当前不可用，请稍后再试。' }}</p>
                  <div class="agent-fallback-actions">
                    <NuxtLink to="/announcements" @click="closeWorkbench">查看公告</NuxtLink>
                    <NuxtLink to="/maintenance" @click="closeWorkbench">服务状态</NuxtLink>
                  </div>
                </section>

                <template v-else>
                  <div class="quick-agent-commands" aria-label="悦灵助手常用指令">
                    <button v-for="command in agentCommands" :key="command.id" type="button" @click="runAgentCommand(command)">
                      {{ command.label }}
                    </button>
                  </div>
                  <div class="quick-agent-message" aria-live="polite">
                    <p v-for="message in agentMessages" :key="message.id" :class="`is-${message.role}`">
                      {{ message.text }}
                    </p>
                  </div>
                  <form class="quick-agent-input" @submit.prevent="sendAgentMessage">
                    <input v-model="agentDraft" type="text" placeholder="问问悦灵..." aria-label="输入给悦灵助手的问题">
                    <button type="submit" :disabled="!agentDraft.trim() || agentStatus === 'sending'">发送</button>
                  </form>
                </template>
              </section>

              <section v-else class="quick-tool-pane is-status">
                <div class="quick-tool-pane-heading">
                  <img class="status-lamp is-large" src="/example-assets/service-redstone-lamp.svg" alt="" aria-hidden="true">
                  <span>
                    <strong>{{ status.label }}</strong>
                    <small>站内工具 / {{ onlineCount }}/{{ status.services.length }} 在线</small>
                  </span>
                </div>
                <div class="quick-status-summary" :class="statusClass">
                  <strong>{{ summaryTitle }}</strong>
                  <p>{{ summaryText }}</p>
                </div>
                <ul class="quick-status-list" aria-label="社团服务状态摘要">
                  <li v-for="service in status.services" :key="service.name" :class="`is-${service.status}`">
                    <span class="service-status-dot" aria-hidden="true"></span>
                    <span>
                      <strong>{{ service.name }}</strong>
                      <small>{{ statusText[service.status] }}</small>
                    </span>
                  </li>
                </ul>
                <NuxtLink class="quick-tool-secondary" :to="status.href" @click="closeWorkbench">
                  查看维护说明
                </NuxtLink>
              </section>
            </div>
          </div>
        </section>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { ApiResponse, ServiceStatus } from '~/types/content'

type ToolId = 'docs' | 'agent' | 'status'
type ToolKind = 'external' | 'internal'

interface ToolItem {
  id: ToolId
  label: string
  kind: ToolKind
  icon: ToolId
  badge: string
  available: boolean
}

interface AgentCommand {
  id: string
  label: string
  prompt: string
  reply: string
}

interface AgentMessage {
  id: number
  role: 'assistant' | 'user'
  text: string
}

interface AgentStatusResponse {
  available: boolean
  message: string
  checkedAt: string
}

const props = defineProps<{
  status: ServiceStatus
  documentCenterUrl?: string
}>()

const statusText = {
  online: '在线',
  maintenance: '维护中',
  offline: '离线'
}

const agentCommands: AgentCommand[] = [
  {
    id: 'activities',
    label: '最近活动',
    prompt: '最近有什么活动？',
    reply: '我会优先帮你查看最近活动，并把可报名或正在进行的活动放在前面。'
  },
  {
    id: 'announcements',
    label: '最新公告',
    prompt: '最新公告是什么？',
    reply: '我会帮你整理最新公告，尤其是维护、活动安排和结果公示。'
  },
  {
    id: 'join',
    label: '加入社团',
    prompt: '我想加入社团。',
    reply: '我会带你查看加入方式、招新要求和社团联系方式。'
  },
  {
    id: 'status',
    label: '服务状态',
    prompt: '服务器现在能玩吗？',
    reply: '你可以切换到社团服务状态工具，那里会显示当前在线和维护情况。'
  }
]

const isWorkbenchOpen = ref(false)
const activeTool = ref<ToolId>('docs')
const agentStatus = ref<'idle' | 'checking' | 'offline' | 'online' | 'sending'>('idle')
const agentStatusMessage = ref('')
const agentDraft = ref('')
const agentMessages = ref<AgentMessage[]>([
  {
    id: 1,
    role: 'assistant',
    text: '你好，我是悦灵助手。这里是快捷面板里的轻量入口，可以先点常用指令。'
  }
])

const documentCenterUrl = computed(() => props.documentCenterUrl?.trim() || '')
const toolCount = computed(() => tools.value.length)
const onlineCount = computed(() => props.status.services.filter((service) => service.status === 'online').length)
const maintenanceCount = computed(() => props.status.services.filter((service) => service.status === 'maintenance').length)
const offlineCount = computed(() => props.status.services.filter((service) => service.status === 'offline').length)
const statusClass = computed(() => (onlineCount.value === props.status.services.length ? 'is-online' : 'has-warning'))
const agentStatusLabel = computed(() => {
  if (agentStatus.value === 'checking') {
    return '连接检测中'
  }

  if (agentStatus.value === 'online' || agentStatus.value === 'sending') {
    return 'Agent 在线'
  }

  if (agentStatus.value === 'offline') {
    return 'Agent 离线'
  }

  return '等待检测'
})
const summaryTitle = computed(() => (statusClass.value === 'is-online' ? '全部服务在线' : '部分服务需要注意'))
const summaryText = computed(() => {
  if (statusClass.value === 'is-online') {
    return '社团服务当前运行正常，可以继续访问相关功能。'
  }

  return `当前 ${onlineCount.value} 项在线，${maintenanceCount.value} 项维护中，${offlineCount.value} 项离线。`
})

const tools = computed<ToolItem[]>(() => [
  {
    id: 'docs',
    label: '文档中心',
    kind: 'external',
    icon: 'docs',
    badge: documentCenterUrl.value ? '↗' : '未配置',
    available: Boolean(documentCenterUrl.value)
  },
  {
    id: 'agent',
    label: '悦灵助手',
    kind: 'internal',
    icon: 'agent',
    badge: '面板',
    available: true
  },
  {
    id: 'status',
    label: '服务状态',
    kind: 'internal',
    icon: 'status',
    badge: `${onlineCount.value}/${props.status.services.length}`,
    available: true
  }
])

const externalTools = computed(() => tools.value.filter((tool) => tool.kind === 'external'))
const internalTools = computed(() => tools.value.filter((tool) => tool.kind === 'internal'))

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function openWorkbench() {
  isWorkbenchOpen.value = true

  if (activeTool.value === 'agent') {
    void checkAgentStatus()
  }
}

function closeWorkbench() {
  isWorkbenchOpen.value = false
}

function selectTool(id: ToolId) {
  activeTool.value = id

  if (id === 'agent') {
    void checkAgentStatus()
  }
}

function toolItemClass(tool: ToolItem) {
  return {
    'is-active': activeTool.value === tool.id,
    'is-external': tool.kind === 'external',
    'is-internal': tool.kind === 'internal',
    'is-unavailable': !tool.available
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isWorkbenchOpen.value) {
    closeWorkbench()
  }
}

function runAgentCommand(command: AgentCommand) {
  if (agentStatus.value !== 'online') {
    return
  }

  appendAgentMessage('user', command.prompt)
  appendAgentMessage('assistant', command.reply)
}

function sendAgentMessage() {
  const text = agentDraft.value.trim()

  if (!text) {
    return
  }

  if (agentStatus.value !== 'online') {
    return
  }

  appendAgentMessage('user', text)
  agentDraft.value = ''
  agentStatus.value = 'sending'

  window.setTimeout(() => {
    appendAgentMessage('assistant', '收到。这里是快捷入口，后续会接入真实 Agent 服务来处理这个问题。')
    agentStatus.value = 'online'
  }, 420)
}

function appendAgentMessage(role: AgentMessage['role'], text: string) {
  agentMessages.value.push({
    id: Date.now() + agentMessages.value.length,
    role,
    text
  })
}

async function checkAgentStatus() {
  if (agentStatus.value === 'checking') {
    return
  }

  agentStatus.value = 'checking'
  agentStatusMessage.value = ''

  try {
    const response = await $fetch<ApiResponse<AgentStatusResponse>>('/api/agent/status')

    if (!response.success || !response.data.available) {
      agentStatus.value = 'offline'
      agentStatusMessage.value = response.success ? response.data.message : response.error.message
      return
    }

    agentStatus.value = 'online'
    agentStatusMessage.value = response.data.message
    agentMessages.value = [
      {
        id: Date.now(),
        role: 'assistant',
        text: '你好，我是悦灵助手。你可以直接提问，也可以先点上方常用指令。'
      }
    ]
  } catch {
    agentStatus.value = 'offline'
    agentStatusMessage.value = 'Agent 服务连接失败，请稍后再试。'
  }
}

</script>
