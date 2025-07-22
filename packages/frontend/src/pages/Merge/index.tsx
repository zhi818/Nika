import {useState} from 'react'

export default function MergePage() {
  const [shandong, setShandong] = useState('')
  const [yulinjue, setYulinjue] = useState('')
  // const [result, setResult] = useState('')

  function parsePlayers(text: string) {
    // 只取“已报名”部分
    const lines = text.split('\n').filter((line: string) => /^\d+\./.test(line.trim()))

    return lines.map((line: string) => {
      // 匹配名字和性别（通过特殊符号区分）
      // 女生常用 🎀 或 🌸，男生常用 🌿 或 🍀
      const nameMatch = line.match(/】([^\s【（]+)/)
      const female = /🎀|🌸/.test(line)
      const male = /🌿|🍀/.test(line)
      return {
        gender: female ? '女' : male ? '男' : '未知',
        name: nameMatch ? nameMatch[1].replace(/^(👑|♠️)+/u, '') : '',
      }
    })
  }

  function parsePlayersV2(text: string) {
    // 只取“已报名人员”部分的报名行
    const lines = text.split('\n').filter((line: string) => /^\d+\./.test(line.trim()))

    return lines.map((line: string) => {
      // 匹配名字
      // 例：1.【3.0】👑丢丢🌸（已）
      const nameMatch = line.match(/】(?:👑|♠️)?([^🌸🍀（\s+]+)/u)
      // 判断性别
      const female = /🌸/.test(line)
      const male = /🍀/.test(line)
      return {
        gender: female ? '女' : male ? '男' : '未知',
        name: nameMatch ? nameMatch[1] : '',
      }
    })
  }

  /**
   * 合并两个报名名单数组，姓名和性别都一样才视为同一人
   * @param {Array<{name: string, gender: string}>} list1
   * @param {Array<{name: string, gender: string}>} list2
   * @returns {Array<{name: string, gender: string}>}
   */
  function mergePlayers(
    list1: Array<{name: string; gender: string}>,
    list2: Array<{name: string; gender: string}>,
  ) {
    const merged = [...list1]
    for (const player of list2) {
      // 检查是否已存在同名同性别
      const exists = merged.some(
        (p) => p.name.toLowerCase() === player.name.toLowerCase() && p.gender === player.gender,
      )
      if (!exists) {
        merged.push(player)
      }
    }
    return merged
  }

  const handleShandongChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setShandong(e.target.value)
  }

  const handleYulinjueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setYulinjue(e.target.value)
  }

  const handleMerge = () => {
    const shandongList = parsePlayers(shandong)
    const yulinjueList = parsePlayersV2(yulinjue)

    console.log(mergePlayers(shandongList, yulinjueList))
    // setResult(`${shandong}\n${yulinjue}`);
  }

  function renderList() {
    const shandongList = parsePlayers(shandong)
    const yulinjueList = parsePlayersV2(yulinjue)
    const mergedList = mergePlayers(shandongList, yulinjueList)

    return mergedList.reduce((res, player, index) => {
      return res + `${index + 1}. ${player.name}\n`
    }, '')
  }

  return (
    <div>
      <h1>Merge Page</h1>
      <textarea
        className="w-full h-64 p-4 border rounded-lg"
        placeholder="shandong"
        onChange={handleShandongChange}
      />
      <textarea
        className="w-full h-64 p-4 border rounded-lg"
        placeholder="yulinjue"
        onChange={handleYulinjueChange}
      />
      <button onClick={handleMerge}>merge</button>
      <textarea
        className="w-full h-64 p-4 border rounded-lg"
        placeholder="result"
        value={renderList()}
      />
    </div>
  )
}
