const chatWithNailong = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const apiKey = process.env.MINIMAX_API_KEY;
    const modelName = process.env.MINIMAX_MODEL || 'MiniMax-Text-01';

    if (apiKey && apiKey !== 'YOUR_MINIMAX_API_KEY' && apiKey.trim() !== '') {
      try {
        const systemMessage = {
          role: 'system',
          content: 'Kamu adalah Dongker, sahabat retro yang santai, lucu, dan akrab. Kamu adalah maskot AI dari platform PERGIMMIKAN. Gaya bicaramu natural, hangat, singkat, dan tidak alay. Gunakan bahasa Indonesia yang enak dibaca dan jangan berlebihan.'
        };

        const payload = {
          model: modelName,
          messages: [systemMessage, ...messages],
          temperature: 0.7
        };

        const response = await fetch('https://api.minimax.io/v1/text/chatcompletion_v2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content || data.reply;
          if (reply) {
            return res.status(200).json({ reply });
          }
        }

        if (response.status === 401 || response.status === 403) {
          return res.status(401).json({
            error: 'Unauthorized',
            errorType: 'invalid_api_key',
            message: 'API key MiniMax tidak valid atau akses ditolak.'
          });
        }

        if (response.status === 429) {
          return res.status(429).json({
            error: 'Too Many Requests',
            errorType: 'rate_limited',
            message: 'Permintaan terlalu banyak. Coba lagi sebentar lagi.'
          });
        }

        if (response.status >= 500) {
          return res.status(502).json({
            error: 'Upstream Error',
            errorType: 'upstream_error',
            message: 'Layanan AI sedang bermasalah.'
          });
        }

        return res.status(502).json({
          error: 'Upstream Error',
          errorType: 'unexpected_response',
          message: 'Respons dari layanan AI tidak bisa diproses.'
        });
      } catch (apiError) {
        console.error('Error calling MiniMax API:', apiError);
        return res.status(502).json({
          error: 'AI Service Unavailable',
          errorType: 'network_error',
          message: 'Tidak bisa terhubung ke layanan AI.'
        });
      }
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const text = lastUserMessage.toLowerCase();

    let reply = '';

    if (text.includes('makan') || text.includes('lapar') || text.includes('kenyang') || text.includes('kuliner')) {
      reply = 'Ngomongin makan selalu aman. Kamu sendiri sudah makan belum?';
    } else if (text.includes('pergimmikan') || text.includes('web') || text.includes('aplikasi') || text.includes('skripsi')) {
      if (text.includes('skripsi') || text.includes('kuliah') || text.includes('tugas')) {
        reply = 'Semangat kuliah dan skripsinya ya. Kalau capek, istirahat dulu sebentar biar otak tetap adem.';
      } else {
        reply = 'PERGIMMIKAN itu tempat buat simpan cerita dan momen seru bareng-bareng. Lumayan buat nostalgia.';
      }
    } else if (text.includes('gunung') || text.includes('darat') || text.includes('camping') || text.includes('tenda') || text.includes('kemah')) {
      reply = 'Petualangan gunung itu seru, tapi tetap jangan lupa persiapan yang aman.';
    } else if (text.includes('siapa') || text.includes('nama') || text.includes('kamu') || text.includes('maskot')) {
      reply = 'Aku Dongker, teman ngobrol retro dari PERGIMMIKAN.';
    } else if (text.includes('halo') || text.includes('hallo') || text.includes('hey') || text.includes('hi') || text.includes('pagi') || text.includes('siang') || text.includes('sore') || text.includes('malam')) {
      reply = 'Halo juga. Lagi pengin ngobrol apa hari ini?';
    } else if (text.includes('lucu') || text.includes('imut') || text.includes('gemas') || text.includes('gemoy')) {
      reply = 'Waduh, makasih. Dongker jadi salah tingkah sedikit.';
    } else if (text.includes('sedih') || text.includes('menangis') || text.includes('capek') || text.includes('lelah') || text.includes('stres')) {
      reply = 'Pelan-pelan dulu. Istirahat sebentar juga tidak apa-apa.';
    } else {
      const randomReplies = [
        'Aku dengerin kok. Lanjut aja ceritanya.',
        'Menarik juga. Coba cerita sedikit lebih detail.',
        'Oke, aku nangkep. Ada bagian lain yang mau kamu bahas?',
        'Sip, lanjut. Dongker siap bantu sebisanya.'
      ];
      reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Error in chatbot controller:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  chatWithNailong
};
