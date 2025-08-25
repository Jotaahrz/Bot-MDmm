import fetch from 'node-fetch';

let handler = async (m, { conn, args, command, usedPrefix }) => {
  const text = args.join(" ");
  if (!text) {
    return m.reply(
      `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ 🎥 *Uso correcto del comando:*
│ ≡◦ ${usedPrefix + command} dj malam pagi slowed
╰─⬣\n> The-MikuBot-MD`
    );
  }

  await m.react('🔍');

  try {
    const res = await fetch(`https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.result?.download?.url) {
      return m.reply(
        `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ❌ *No se encontró video para:* ${text}
╰─⬣`
      );
    }

    const {
      metadata: {
        title,
        description,
        duration,
        views,
        author,
        url,
        thumbnail
      },
      download: {
        url: videoUrl,
        filename,
        quality
      }
    } = json.result;

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: `╭─⬣「 *Descargador YouTube (Video)* 」⬣
│ ≡◦ 🎬 *Título:* ${title}
│ ≡◦ 👤 *Autor:* ${author.name}
│ ≡◦ ⏱️ *Duración:* ${duration.timestamp}
│ ≡◦ 👁️ *Vistas:* ${views}
│ ≡◦ 🌐 *YouTube:* ${url}
│ ≡◦ 📹 *Calidad:* ${quality}
│ ≡◦ 📝 *Descripción:* ${description}
╰─⬣`
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      mimetype: 'video/mp4',
      fileName: filename,
      caption: `🎬 ${title}`
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    return m.reply(
      `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ⚠️ *Error al procesar la solicitud.*
│ ≡◦ Intenta nuevamente más tarde.
╰─⬣`
    );
  }
};

handler.help = ['play2', 'ytmp4'];
handler.tags = ['descargas'];
handler.command = ['playvideo', 'ytmp4'];
handler.register = true;

export default handler;