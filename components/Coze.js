import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

/**
 * Coze-AI机器人
 * @returns
 */
export default function Coze() {
  const cozeContainerRef = useRef(null)
  const cozeSrc = siteConfig(
    'COZE_SRC_URL',
    'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.3/libs/cn/index.js'
  )
  const title = siteConfig('COZE_TITLE', '苏瑶')
  const botId = siteConfig('COZE_BOT_ID')

  const [isLoading, setIsLoading] = useState(true)

  const loadCoze = async () => {
    try {
      setIsLoading(true)
      await loadExternalResource(cozeSrc)
      const CozeWebSDK = window?.CozeWebSDK
      if (CozeWebSDK && cozeContainerRef.current) {
        const cozeClient = new CozeWebSDK.WebChatClient({
          config: {
            bot_id: botId
          },
          componentProps: {
            title: title
          },
          // 添加认证信息
          auth: {
            type: 'token',
            token: 'pat_NOsR8AIQlZmnkUK61xokwNJcwgLdt3srDjDeJxXqBBiTTD7VKx7BfdylHK1yfKoz',
            onRefreshToken: function () {
              return 'pat_NOsR8AIQlZmnkUK61xokwNJcwgLdt3srDjDeJxXqBBiTTD7VKx7BfdylHK1yfKoz'
            }
          }
        })
        
        cozeClient.render(cozeContainerRef.current)
        console.log('coze initialized', cozeClient)
      }
    } catch (error) {
      console.error('Coze initialization failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!botId) {
      console.error('COZE_BOT_ID 未设置，请在配置中设置正确的 BOT ID')
      return
    }
    loadCoze()
  }, [])
  
  return (
    <div className="coze-wrapper">
      {isLoading && <div className="coze-loading">加载中...</div>}
      <div 
        ref={cozeContainerRef} 
        className="coze-container" 
        style={{ width: '100%', height: '600px', border: '1px solid #eaeaea', borderRadius: '8px' }}
      ></div>
    </div>
  )
}
