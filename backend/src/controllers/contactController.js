import { ContactMessage } from '../models/contactMessageModel.js';
import { emailService } from '../services/emailService.js';
import { Notification } from '../models/notificationModel.js';

export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, subject and message' });
    }

    const newMessage = await ContactMessage.create({ name, email, subject, message });

    // Send email notification to admin and confirmation to sender (non-blocking)
    emailService.sendContactEmails({ name, email, subject, message });

    // Save dashboard notification for admin
    await Notification.create({
      title: 'New Contact Message',
      message: `Message from ${name}: "${subject}"`,
      type: 'contact'
    });

    res.status(201).json({ success: true, data: newMessage, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact submit error:', error);
    res.status(500).json({ success: false, message: 'Error submitting contact message' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll();
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ success: false, message: 'Error fetching contact messages' });
  }
};

export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['unread', 'read', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updated = await ContactMessage.updateStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ success: false, message: 'Message not found' });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ success: false, message: 'Error updating message status' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const deleted = await ContactMessage.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Message not found' });

    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete contact message error:', error);
    res.status(500).json({ success: false, message: 'Error deleting message' });
  }
};
