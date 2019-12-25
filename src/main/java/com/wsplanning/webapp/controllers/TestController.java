package com.wsplanning.webapp.controllers;

import com.google.gson.Gson;
import com.wsplanning.webapp.clients.EmployeesClient;
import com.wsplanning.webapp.clients.TaskClient;
import com.wsplanning.webapp.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpSession;
import javax.swing.*;
import java.awt.*;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;

@Controller
public class TestController extends BaseController {
    private Logger logger = LoggerFactory.getLogger(TestController.class);

    @Autowired
    protected EmployeesClient employeesClient;

    @Autowired
    protected TaskClient taskClient;

    @Autowired
    protected HttpSession session;

    @Autowired
    HttpSession httpSession;

    Gson gson = new Gson();

    @GetMapping("/test/testimage")
    @ResponseBody
    public ResponseEntity testimage() {
        try {
            String path = "image" + File.separator + "template" + File.separator + "taixuong.png";
//            String outPath = "image" + File.separator + "template" + File.separator + "taixuong12";
            String outPath = "/Volumes/DATA/tmp/tmp/img" + File.separator + "taixuong12";

//            File file = new File(path);
//            if (!file.exists()) {
//                return new ResponseEntity("RESET_CONTENT", HttpStatus.RESET_CONTENT);
//            }
//
//            ImageIcon photo = new ImageIcon(path);
//

            byte[] input = Utils.readFileInResource(path);

            if (input == null) {
                return new ResponseEntity("RESET_CONTENT", HttpStatus.RESET_CONTENT);
            }

            ImageIcon photo = new ImageIcon(input, "");

            //Create an image 200 x 200
            BufferedImage bufferedImage = new BufferedImage(photo.getIconWidth(),
                    photo.getIconHeight(),
                    BufferedImage.TYPE_INT_RGB);
            Graphics2D g2d = (Graphics2D) bufferedImage.getGraphics();

            g2d.drawImage(photo.getImage(), 0, 0, null);

            //Create an alpha composite of 50%
            AlphaComposite alpha = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.5f);
            g2d.setComposite(alpha);

            g2d.setColor(Color.white);
            g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING,
                    RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

            g2d.setFont(new Font("Arial", Font.BOLD, 30));

            String watermark = "Copyright � 2006 thuyetlv";

            FontMetrics fontMetrics = g2d.getFontMetrics();
            Rectangle2D rect = fontMetrics.getStringBounds(watermark, g2d);

            g2d.drawString(watermark,
                    (photo.getIconWidth() - (int) rect.getWidth()) / 2,
                    (photo.getIconHeight() - (int) rect.getHeight()) / 2);

            //Free graphic resources
            g2d.dispose();

            //Write the image as a jpg
            // Luồng ghi dữ liệu vào file
//            OutputStream out = new FileOutputStream(outPath);

            File yourFile = new File(outPath + ".png");
            yourFile.createNewFile(); // if file already exists will do nothing
            FileOutputStream out = new FileOutputStream(yourFile, false);

            ImageIO.write(bufferedImage, "png", out);
            out.close();


            //aaa
            String base64 = "";
            try {
                base64 = Utils.encodeFileToBase64AtResource2(outPath + ".png");
            } catch (Exception ex) {
                logger.error("Error: ", ex);
                base64 = Utils.encodeFileToBase64Binary(outPath + ".png");
            }

            return new ResponseEntity<>(base64, HttpStatus.OK);
        } catch (Exception ex) {
            return parseException(ex);
        }
    }
}
