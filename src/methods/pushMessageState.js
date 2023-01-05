import emitter from '@/methods/emitter';

export default function toastMessage(response, title = '更新') {
  if (response.data.success) {
    emitter.emit('push-message', {
      style: 'success',
      title: `${title}成功`,
    });
  } else {
    // 將message的資料格式統一為陣列避免出錯
    const message = typeof response.data.message === 'string' ? [response.data.message] : response.data.message;
    emitter.emit('push-message', {
      style: 'danger',
      title: `${title}失敗`,
      content: message.join('、'),
    });
  }
}
