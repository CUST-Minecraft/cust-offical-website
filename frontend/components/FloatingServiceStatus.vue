<template>
  <div class="floating-service-status" :class="{ 'is-open': isWorkbenchOpen }" :style="floatingStyle">
    <button
      class="floating-dock-summary"
      type="button"
      :aria-label="`打开社团服务，${serviceCount} 项服务可用`"
      title="打开社团服务"
      @click="openWorkbench"
    >
        <span class="community-workbench-icon is-compact" aria-hidden="true">
          <img src="/example-assets/community-workbench.svg" alt="">
        </span>
        <span class="floating-dock-copy">
          <strong>社团服务</strong>
          <small v-field-hint="maintenanceFieldHint('serviceStatusServices', '右下角服务数量')">{{ serviceCount }} 项服务可用</small>
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
            <span class="quick-tools-title">
              <strong id="quick-tools-title">社团服务</strong>
              <small>Community Services Workbench</small>
            </span>
            <div class="quick-tools-header-actions">
              <button class="quick-tools-status-link" :class="statusClass" type="button" :aria-pressed="isStatusPanelOpen" @click="openStatusPanel">
                  <span class="status-lamp is-status-link" aria-hidden="true"></span>
                  <span>
                  <strong v-field-hint="maintenanceFieldHint('serviceStatusServices', '社团服务在线数量')">{{ onlineCount }}/{{ serviceTotal }} 在线</strong>
                  <small v-field-hint="maintenanceFieldHint('serviceStatusServices', '社团服务状态摘要')">{{ summaryTitle }}</small>
                </span>
              </button>
              <button class="quick-tools-close" type="button" aria-label="关闭社团服务" title="关闭" @click="closeWorkbench">
                X
              </button>
            </div>
          </header>

          <div class="quick-tools-body" :class="{ 'is-status-view': isStatusPanelOpen }">
            <Transition name="quick-workbench-view" mode="out-in">
              <section v-if="isStatusPanelOpen" key="status" class="quick-tool-pane quick-status-panel">
                <div class="quick-tool-pane-heading">
                  <span class="status-lamp is-large" aria-hidden="true"></span>
                  <span>
                    <strong v-field-hint="maintenanceFieldHint('serviceStatusLabel', '服务状态入口标题')">{{ status.label }}</strong>
                    <small v-field-hint="maintenanceFieldHint('serviceStatusServices', '服务状态在线数量')">服务状态 / {{ onlineCount }}/{{ serviceTotal }} 在线</small>
                  </span>
                </div>
                <div class="quick-status-summary" :class="statusClass">
                  <strong v-field-hint="maintenanceFieldHint('serviceStatusServices', '服务状态摘要标题')">{{ summaryTitle }}</strong>
                  <p v-field-hint="maintenanceFieldHint('serviceStatusServices', '服务状态摘要说明')">{{ statusSummaryText }}</p>
                </div>
                <ul class="quick-status-list" aria-label="社团服务状态摘要">
                  <li v-for="service in status.services" :key="service.name" :class="`is-${service.status}`">
                    <span class="service-status-dot" aria-hidden="true"></span>
                    <span>
                      <strong v-field-hint="maintenanceFieldHint('serviceStatusServices.name', `服务状态条目：${service.name}`)">{{ service.name }}</strong>
                      <small v-field-hint="maintenanceFieldHint('serviceStatusServices.status', `服务状态值：${service.name}`)">{{ statusText[service.status] }}</small>
                    </span>
                  </li>
                </ul>
                <div class="quick-status-actions">
                  <button class="quick-tool-secondary" type="button" @click="closeStatusPanel">
                    返回服务列表
                  </button>
                </div>
              </section>

              <div v-else key="services" class="quick-tools-service-view">
                <nav class="quick-tools-list" aria-label="社团服务列表">
                  <span class="quick-tools-group-label">外部入口</span>
                  <button
                    v-for="service in externalServiceItems"
                    :key="service.id"
                    class="quick-tool-item"
                    :class="serviceItemClass(service)"
                    type="button"
                    :aria-pressed="activeService === service.id"
                    @click="selectService(service.id)"
                  >
                    <span class="quick-tool-icon" aria-hidden="true">
                      <img v-if="service.icon === 'docs'" class="docs-shelf-icon" src="/example-assets/bookshelf-docs.svg" alt="">
                    </span>
                    <span v-field-hint="externalServiceFieldHint('name', `社团服务工作台入口：${service.label}`)" class="quick-tool-name">{{ service.label }}</span>
                    <small v-field-hint="externalServiceFieldHint('url', `社团服务工作台链接状态：${service.label}`)">{{ service.badge }}</small>
                  </button>

                  <span class="quick-tools-group-label">站内服务</span>
                  <button
                    v-for="service in internalServices"
                    :key="service.id"
                    class="quick-tool-item"
                    :class="serviceItemClass(service)"
                    type="button"
                    :aria-pressed="activeService === service.id"
                    @click="selectService(service.id)"
                  >
                    <span class="quick-tool-icon" aria-hidden="true">
                      <span v-if="service.icon === 'agent'" class="allay-agent-icon is-tool">
                        <img src="/example-assets/allay-agent-cute.png" alt="">
                      </span>
                    </span>
                    <span v-field-hint="externalServiceFieldHint('name', `社团服务工作台入口：${service.label}`)" class="quick-tool-name">{{ service.label }}</span>
                    <small v-field-hint="externalServiceFieldHint('showInWorkbench', `社团服务工作台展示状态：${service.label}`)">{{ service.badge }}</small>
                  </button>
                </nav>

                <div class="quick-tools-stage">
                  <Transition name="quick-tool-pane-swap" mode="out-in">
                    <section v-if="activeService === 'docs'" key="docs" class="quick-tool-pane is-external">
                      <div class="quick-tool-pane-heading">
                        <img class="docs-shelf-icon is-large" src="/example-assets/bookshelf-docs.svg" alt="" aria-hidden="true">
                        <span>
                          <strong v-field-hint="externalServiceFieldHint('name', '文档中心面板标题')">{{ docsService?.name || '文档中心' }}</strong>
                          <small v-field-hint="externalServiceFieldHint('url', '文档中心链接状态')">{{ documentCenterUrl ? '外部系统 / 新标签页打开' : '外部系统 / 未配置' }}</small>
                        </span>
                      </div>
                      <p v-field-hint="externalServiceFieldHint('summary', '文档中心面板说明')">{{ docsService?.summary || '文档中心由独立系统处理账号、权限、文档编辑和访问控制。官网只提供公开跳转入口。' }}</p>
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

                    <section v-else key="agent" class="quick-tool-pane is-agent">
                      <div class="quick-tool-pane-heading">
                        <span class="allay-agent-icon is-pane" aria-hidden="true">
                          <img src="/example-assets/allay-agent-cute.png" alt="">
                        </span>
                        <span>
                          <strong>悦灵助手</strong>
                          <small>站内服务 / {{ agentStatusLabel }}</small>
                        </span>
                      </div>
                      <Transition name="quick-agent-state-swap" mode="out-in">
                        <section v-if="agentStatus === 'checking'" key="checking" class="quick-agent-state">
                          <span class="agent-scan-icon" aria-hidden="true">
                            <img src="/example-assets/allay-agent-cute.png" alt="">
                          </span>
                          <strong>正在连接 Agent 服务</strong>
                          <p>悦灵正在确认对话服务状态。</p>
                          <span class="agent-scan-bar" aria-hidden="true"></span>
                        </section>

                        <section v-else-if="agentStatus === 'offline'" key="offline" class="quick-agent-state">
                          <span class="agent-offline-rune" aria-hidden="true"></span>
                          <strong>悦灵助手暂时离线</strong>
                          <p>{{ agentStatusMessage || 'Agent 服务当前不可用，请稍后再试。' }}</p>
                        </section>

                        <div v-else :key="agentStatus === 'sending' ? 'sending' : 'online'" class="quick-agent-live">
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
                        </div>
                      </Transition>
                    </section>
                  </Transition>
                </div>
              </div>
            </Transition>
          </div>
        </section>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { ApiResponse, ExternalService, ServiceStatus } from '~/types/content'
import { externalServiceFieldHint, maintenanceFieldHint } from '~/utils/field-hints'

type ServiceId = 'docs' | 'agent'
type ServiceKind = 'external' | 'internal'

interface ServiceItem {
  id: ServiceId
  label: string
  kind: ServiceKind
  icon: ServiceId
  badge: string
  available: boolean
  summary?: string
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
  externalServices: ExternalService[]
}>()

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
    reply: '你可以查看标题栏的服务状态入口，那里会显示当前在线和维护情况。'
  }
]

const isWorkbenchOpen = ref(false)
const isStatusPanelOpen = ref(false)
const activeService = ref<ServiceId>('docs')
const agentStatus = ref<'idle' | 'checking' | 'offline' | 'online' | 'sending'>('idle')
const agentStatusMessage = ref('')
const agentDraft = ref('')
const agentMessages = ref<AgentMessage[]>([
  {
    id: 1,
    role: 'assistant',
    text: '你好，我是悦灵助手。这里是社团服务工作台里的轻量入口，可以先点常用指令。'
  }
])

const docsService = computed(() => props.externalServices.find((service) => service.key === 'docs' && service.showInWorkbench))
const agentService = computed(() => props.externalServices.find((service) => service.key === 'agent' && service.showInWorkbench))
const documentCenterUrl = computed(() => (docsService.value?.enabled ? docsService.value.url?.trim() : '') || '')
const serviceCount = computed(() => services.value.length)
const serviceTotal = computed(() => props.status.services.length)
const onlineCount = computed(() => props.status.services.filter((service) => service.status === 'online').length)
const maintenanceCount = computed(() => props.status.services.filter((service) => service.status === 'maintenance').length)
const offlineCount = computed(() => props.status.services.filter((service) => service.status === 'offline').length)
const statusClass = computed(() => (serviceTotal.value > 0 && onlineCount.value === serviceTotal.value ? 'is-online' : 'has-warning'))
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
const statusSummaryText = computed(() => {
  if (statusClass.value === 'is-online') {
    return '社团服务当前运行正常，可以继续访问相关功能。'
  }

  return `当前 ${onlineCount.value} 项在线，${maintenanceCount.value} 项维护中，${offlineCount.value} 项离线。`
})

const statusText = {
  online: '在线',
  maintenance: '维护中',
  offline: '离线'
}

const services = computed<ServiceItem[]>(() => [
  {
    id: 'docs',
    label: docsService.value?.name || '文档中心',
    kind: 'external',
    icon: 'docs',
    badge: documentCenterUrl.value ? '↗' : '未配置',
    available: Boolean(documentCenterUrl.value),
    summary: docsService.value?.summary
  },
  {
    id: 'agent',
    label: agentService.value?.name || '悦灵助手',
    kind: 'internal',
    icon: 'agent',
    badge: '站内',
    available: agentService.value?.enabled ?? true,
    summary: agentService.value?.summary
  }
])

const externalServiceItems = computed(() => services.value.filter((service) => service.kind === 'external'))
const internalServices = computed(() => services.value.filter((service) => service.kind === 'internal'))
const { floatingFooterStyle: floatingStyle } = useFloatingFooterOffset()

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function openWorkbench() {
  isStatusPanelOpen.value = false
  isWorkbenchOpen.value = true

  if (activeService.value === 'agent') {
    void checkAgentStatus()
  }
}

function closeWorkbench() {
  isWorkbenchOpen.value = false
}

function selectService(id: ServiceId) {
  isStatusPanelOpen.value = false
  activeService.value = id

  if (id === 'agent') {
    void checkAgentStatus()
  }
}

function openStatusPanel() {
  isStatusPanelOpen.value = true
}

function closeStatusPanel() {
  isStatusPanelOpen.value = false
}

function serviceItemClass(service: ServiceItem) {
  return {
    'is-active': activeService.value === service.id,
    'is-external': service.kind === 'external',
    'is-internal': service.kind === 'internal',
    'is-unavailable': !service.available
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
    appendAgentMessage('assistant', '收到。这里是社团服务入口，后续会接入真实 Agent 服务来处理这个问题。')
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
