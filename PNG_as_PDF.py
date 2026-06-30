#pip install Pillow
import os
import re
from PIL import Image
import tkinter as tk
from tkinter import filedialog

def natural_sort_key(s):
    """
    自然排序函数，解决 1, 10, 2 的排序问题，使其变成 1, 2, 10
    """
    return [int(text) if text.isdigit() else text.lower() for text in re.split('([0-9]+)', s)]

def images_to_pdf(folder_path):
    # 支持的图片格式
    valid_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff')
    
    # 获取文件夹内所有文件，并筛选出图片
    files = [f for f in os.listdir(folder_path) if f.lower().endswith(valid_extensions)]
    
    if not files:
        print("该文件夹中没有找到支持的图片文件！")
        return

    # 按照自然顺序排序
    files.sort(key=natural_sort_key)
    print(f"找到 {len(files)} 张图片，开始合并...")

    img_list = []
    for file in files:
        img_path = os.path.join(folder_path, file)
        try:
            img = Image.open(img_path)
            # 如果图片带有透明通道(如PNG)，需要转换为RGB模式，否则保存PDF会报错
            if img.mode == 'RGBA':
                img = img.convert('RGB')
            img_list.append(img)
        except Exception as e:
            print(f"无法读取图片 {file}，已跳过。错误信息: {e}")

    if not img_list:
        print("没有可用的图片，程序结束。")
        return

    # 设置输出PDF的路径（保存在原文件夹下，命名为"合并图片.pdf"）
    output_pdf_path = os.path.join(folder_path, "合并图片.pdf")

    try:
        # 第一张图作为主文件，后面的图作为追加
        first_image = img_list[0]
        remaining_images = img_list[1:]
        
        first_image.save(
            output_pdf_path,
            save_all=True,
            append_images=remaining_images,
            resolution=100.0,  # DPI分辨率，可按需调整
        )
        print(f"✅ 成功！PDF已生成至：{output_pdf_path}")
    except Exception as e:
        print(f"❌ 生成PDF时出错：{e}")

if __name__ == "__main__":
    # 隐藏tkinter主窗口
    root = tk.Tk()
    root.withdraw()

    # 弹出文件夹选择对话框
    print("请选择包含图片的文件夹...")
    folder_selected = filedialog.askdirectory(title="请选择图片文件夹")

    if folder_selected:
        images_to_pdf(folder_selected)
    else:
        print("未选择文件夹，程序已取消。")