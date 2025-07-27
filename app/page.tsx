'use client'

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { TableList } from "@/components/table-list"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Item } from "./item"
import { Chat } from "@/components/chat"

export default function Page() {
  const [listaItems, setListaItems] = useState<Item[]>([]);
  const [itemName, setItemName] = useState('');
  const [quantidade, setQuantidade] = useState(0);

  const handleAddItem = async () => {
    if (!itemName || !quantidade) return;

    const newItem: Item = {
      id: listaItems.length + 1,
      item: itemName,
      qtd: quantidade,
      checked: false
    };

    setListaItems([...listaItems, newItem]);
    setItemName('');
    setQuantidade(0);

    await fetchLista();
  };

  const handleRemoveItem = (id: number) => {
    setListaItems(listaItems.filter(item => item.id !== id));
  };

  useEffect(() => {
    fetchLista();
  }, []);


  const fetchLista = async () => {
    try {
      const res = await fetch("http://localhost:5000/lista");
      const data = await res.json();

      if (data.lista) {
        const formatted = data.lista.map((item: any, index: number) => ({
          id: index + 1,
          item: item[0],
          qtd: item[1],
          checked: false
        }));
        setListaItems(formatted);
      }
    } catch (err) {
      console.error("Erro ao buscar lista:", err);
    }
  };


  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        <Chat reload={fetchLista} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex p-10 flex-1 flex-col gap-2 items-center">
            <h1 className="text-[32px] text-center mb-5">Lista de Compras</h1>
            <br />
            <div className="flex w-[50%] mb-10 items-end justify-center">
              <div className="text-center flex flex-col">
                <Label className="mb-4">Item</Label>
                <Input
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>
              <div className="text-center flex flex-col ml-6">
                <Label className="mb-4">Quantidade</Label>
                <Input
                  className="w-[50%]"
                  value={quantidade}
                  onChange={(e) => setQuantidade(parseInt(e.target.value))}
                />
              </div>
              <Button
                className="ml-2 cursor-pointer"
                onClick={handleAddItem}
              >
                <Plus /> Adicionar
              </Button>
            </div>
            <TableList lista={listaItems} onRemoveItem={handleRemoveItem} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
