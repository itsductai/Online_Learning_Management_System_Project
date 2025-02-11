import cv2
import numpy as np
from PIL import Image

def apply_gradient(image, colors):
    """
    Áp dụng gradient màu lên logo.
    """
    h, w, _ = image.shape
    gradient = np.zeros((h, w, 3), dtype=np.uint8)
    
    for i in range(h):
        ratio = i / h
        r = int(colors[0][0] * (1 - ratio) + colors[-1][0] * ratio)
        g = int(colors[0][1] * (1 - ratio) + colors[-1][1] * ratio)
        b = int(colors[0][2] * (1 - ratio) + colors[-1][2] * ratio)
        gradient[i, :, :] = (b, g, r)
    
    mask = image[:, :, 3] / 255.0
    mask = np.expand_dims(mask, axis=2)
    colored_image = (gradient * mask + image[:, :, :3] * (1 - mask)).astype(np.uint8)
    return cv2.merge([colored_image[:, :, 0], colored_image[:, :, 1], colored_image[:, :, 2], image[:, :, 3]])

def process_image(input_path, output_path):
    """
    Xử lý ảnh: tách nền trắng, chuyển màu đen thành gradient.
    """
    image = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    if image.shape[2] == 3:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
    
    white_mask = (image[:, :, 0] > 200) & (image[:, :, 1] > 200) & (image[:, :, 2] > 200)
    image[white_mask, 3] = 0  # Biến nền trắng thành trong suốt
    
    black_mask = (image[:, :, 0] < 50) & (image[:, :, 1] < 50) & (image[:, :, 2] < 50)
    image[black_mask, 3] = 255
    
    colors_hex = ['#925892', '#C05E91', '#FFC39D', '#FE9397', '#F86888']
    colors_rgb = [tuple(int(h[i:i+2], 16) for i in (1, 3, 5)) for h in colors_hex]
    
    image = apply_gradient(image, colors_rgb)
    cv2.imwrite(output_path, image)
    
if __name__ == "__main__":
    input_image = "1.png"  # Đổi thành đường dẫn hình ảnh của bạn
    output_image = "radient_logo_v1.png"
    process_image(input_image, output_image)
    print(f"Processed image saved as {output_image}")
