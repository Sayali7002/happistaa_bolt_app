import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { Button } from '../common/Button';
import { PeerMatch } from '../../types';

interface ConnectionModalProps {
  visible: boolean;
  peer: PeerMatch;
  onClose: () => void;
  onSubmit: (message: string, isAnonymous: boolean) => void;
  isSubmitting: boolean;
  sharedJourneys?: string[];
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  visible,
  peer,
  onClose,
  onSubmit,
  isSubmitting,
  sharedJourneys = [],
}) => {
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Default placeholder message based on peer support type
  const getPlaceholderMessage = () => {
    if (peer.supportType === 'support-giver') {
      return `Hi ${peer.name}, I saw you have experience with ${peer.supportPreferences[0] || 'this journey'}. I'm in a similar situation and would love to hear about your experience and ask a few questions. Thanks!`;
    } else {
      return `Hi ${peer.name}, I noticed we share similar experiences with ${peer.supportPreferences[0] || 'this journey'}. I'd be happy to connect and share what worked for me if that would be helpful.`;
    }
  };

  const handleSubmit = () => {
    onSubmit(message.trim() || getPlaceholderMessage(), isAnonymous);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Send a connection request to {peer.name}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {sharedJourneys.length > 0 && (
            <View style={styles.sharedJourneysContainer}>
              <Text style={styles.sharedJourneysText}>
                You are connecting with {peer.name} about: {sharedJourneys.join(', ')}
              </Text>
            </View>
          )}
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>
              Add a personal message (recommended)
            </Text>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder={getPlaceholderMessage()}
              placeholderTextColor="#A0AEC0"
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.characterCount}>
              {500 - message.length} characters remaining
            </Text>
            
            <View style={styles.anonymousContainer}>
              <View style={styles.anonymousTextContainer}>
                <Text style={styles.anonymousLabel}>Connect Anonymously</Text>
                <Text style={styles.anonymousDescription}>
                  Your name and profile picture will be hidden until you choose to reveal them in the chat.
                </Text>
              </View>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                trackColor={{ false: '#E2E8F0', true: '#1E3A5F' }}
                thumbColor={isAnonymous ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title={isSubmitting ? 'Sending...' : 'Send Request'}
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.submitButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#A0AEC0',
  },
  sharedJourneysContainer: {
    backgroundColor: '#EBF8FF',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#BEE3F8',
  },
  sharedJourneysText: {
    fontSize: 14,
    color: '#2B6CB0',
  },
  modalContent: {
    padding: 16,
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    height: 120,
    fontSize: 16,
    color: '#2D3748',
    backgroundColor: '#F7FAFC',
  },
  characterCount: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 16,
  },
  anonymousContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 8,
  },
  anonymousTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  anonymousLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 4,
  },
  anonymousDescription: {
    fontSize: 12,
    color: '#718096',
    lineHeight: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelButton: {
    marginRight: 12,
  },
  submitButton: {
    minWidth: 120,
  },
});