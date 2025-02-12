import cv2
import numpy as np

def remove_black_background(input_path, output_path):
    """
    Tách nền màu đen ra khỏi hình ảnh, biến màu đen thành trong suốt.
    """
    image = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    
    if image is None:
        raise FileNotFoundError(f"Không tìm thấy file: {input_path}")
    
    # Chuyển ảnh sang định dạng BGRA nếu chưa có kênh alpha
    if image.shape[2] == 3:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
    
    # Xác định vùng màu đen (ngưỡng dưới 50 trên cả ba kênh RGB)
    black_mask = (image[:, :, 0] < 50) & (image[:, :, 1] < 50) & (image[:, :, 2] < 50)
    
    # Biến màu đen thành trong suốt
    image[black_mask, 3] = 0  # Đặt kênh alpha thành 0
    
    # Lưu ảnh kết quả
    cv2.imwrite(output_path, image)
    print(f"Processed image saved as {output_path}")

if __name__ == "__main__":
    input_image = "7.png"  # Đổi thành đường dẫn hình ảnh của bạn
    output_image = "logo_color_text_v2.png"
    remove_black_background(input_image, output_image)