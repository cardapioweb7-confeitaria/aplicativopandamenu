// Save to database
      // Changed video_url to pdf_url to match database schema
      const { error: dbError } = await supabase
        .from('receitas')
        .insert({
          titulo: formData.titulo,
          categoria: formData.categoria,
          descricao: formData.descricao || '', // Provide empty string if no description
          imagem_url: imagemData.publicUrl,
          pdf_url: pdfData.publicUrl,
          ingredientes: [], // Add empty ingredients array to satisfy NOT NULL constraint
          user_id: user?.id,
          is_global: true
        })