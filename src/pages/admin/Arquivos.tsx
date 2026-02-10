"use client";

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { showSuccess, showError } from '@/utils/toast'
import { Upload, Image, Trash2 } from 'lucide-react'

export default function Arquivos() {
  const [files, setFiles] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const { data } = await supabase.storage.from('images').list()
      setFiles(data || [])
    } catch (error) {
      showError('Erro ao carregar arquivos')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    
    setUploading(true)
    try {
      const fileName = `${Date.now()}-${selectedFile.name}`
      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, selectedFile)
      
      if (error) throw error
      
      showSuccess('Arquivo enviado!')
      setSelectedFile(null)
      fetchFiles()
    } catch (error) {
      showError('Erro ao enviar arquivo')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileName: string) => {
    if (!confirm('Excluir este arquivo?')) return
    
    try {
      const { error } = await supabase.storage
        .from('images')
        .remove([fileName])
      
      if (error) throw error
      
      showSuccess('Arquivo excluído!')
      fetchFiles()
    } catch (error) {
      showError('Erro ao excluir arquivo')
    }
  }

  return (
    <div className="min-h-screen space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Meus Arquivos</h1>
        <div className="flex gap-2">
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button asChild>
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Enviar
              </div>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
            {uploading ? 'Enviando...' : 'Confirmar Upload'}
          </Button>
        </div>
      </div>

      {files.length === 0 ? (
        <Card className="text-center p-12">
          <CardTitle>Nenhum arquivo</CardTitle>
          <CardContent className="pt-4">
            <p>Envie suas imagens para usar nos banners e logos!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {files.map((file) => (
            <Card key={file.name} className="group hover:shadow-xl transition-all overflow-hidden">
              <CardHeader className="p-0 h-48 bg-gray-100 flex items-center justify-center">
                <Image className="w-12 h-12 text-gray-400 group-hover:text-gray-600" />
                <img 
                  src={supabase.storage.from('images').getPublicUrl(file.name).data.publicUrl}
                  alt={file.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100"
                />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8"
                    onClick={() => {
                      navigator.clipboard.writeText(supabase.storage.from('images').getPublicUrl(file.name).data.publicUrl)
                      showSuccess('URL copiada!')
                    }}
                  >
                    Copiar URL
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDelete(file.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}