const getMsgContent = type =>
  new Promise(async (resolve, reject) => {
    try {
      const query = `
        SELECT text, designate_dat
        FROM sms_text 
        WHERE type = ?
        Order By last_updated desc
       ;`
      const result = await db.query(query, [type])
      const text = result.length > 0 ? result[0].text : ''
      resolve(text)
    } catch (err) {
      reject(err)
    }
  })

module.exports = {
  getMsgContent
}
