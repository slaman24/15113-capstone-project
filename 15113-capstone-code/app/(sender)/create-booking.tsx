import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  CheckBox,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { mockSudsers, serviceOptions } from '@/lib/mock-data';
import { useBookings } from '@/context/bookings-context';
import { useAuth } from '@/context/auth-context';
import { ServiceType } from '@/types';

export default function CreateBookingScreen() {
  const { sudserID, sudserName } = useLocalSearchParams<{
    sudserID: string;
    sudserName: string;
  }>();
  const sudser = mockSudsers.find(s => s.id === sudserID);
  const { addBooking } = useBookings();
  const { user } = useAuth();

  const [selectedServices, setSelectedServices] = useState<ServiceType[]>(['wash_fold']);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [step, setStep] = useState<'services' | 'datetime' | 'review'>('services');

  if (!sudser) {
    return (
      <View style={styles.container}>
        <Text>Sudser not found</Text>
      </View>
    );
  }

  const toggleService = (service: ServiceType) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const estimatedPrice = selectedServices.reduce((total, service) => {
    const serviceOpt = serviceOptions.find(s => s.id === service);
    return total + (serviceOpt?.basePrice || 0);
  }, sudser.hourlyRate);

  const handleNextStep = () => {
    if (step === 'services') {
      if (selectedServices.length === 0) {
        Alert.alert('Please select at least one service');
        return;
      }
      setStep('datetime');
    } else if (step === 'datetime') {
      if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
        Alert.alert('Please fill in all date and time fields');
        return;
      }
      setStep('review');
    }
  };

  const handleConfirmBooking = () => {
    const newBooking = {
      id: `booking_${Date.now()}`,
      senderId: user?.id || '',
      sudserName: sudser.name,
      sudserPhoto: sudser.profilePhoto,
      services: selectedServices,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      status: 'pending' as const,
      estimatedPrice,
      specialNotes: specialNotes || undefined,
      pickupAddress: (user as any)?.address,
      createdAt: new Date().toISOString(),
    };

    addBooking(newBooking);
    Alert.alert('✅ Booking Confirmed!', `Your booking with ${sudser.name} is confirmed. They will be notified shortly.`);
    router.dismissAll();
  };

  const handleBack = () => {
    if (step === 'services') {
      router.back();
    } else {
      setStep(step === 'datetime' ? 'services' : 'datetime');
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, step === 'services' && styles.progressDotActive]} />
        <View style={[styles.progressLine, (step === 'datetime' || step === 'review') && styles.progressLineActive]} />
        <View style={[styles.progressDot, (step === 'datetime' || step === 'review') && styles.progressDotActive]} />
        <View style={[styles.progressLine, step === 'review' && styles.progressLineActive]} />
        <View style={[styles.progressDot, step === 'review' && styles.progressDotActive]} />
      </View>

      <Text style={styles.stepLabel}>
        Step {step === 'services' ? '1' : step === 'datetime' ? '2' : '3'} of 3
      </Text>

      <ScrollView style={styles.content}>
        {/* Services Step */}
        {step === 'services' && (
          <View>
            <Text style={styles.title}>What services do you need?</Text>
            <Text style={styles.subtitle}>Select one or more services</Text>

            {sudser.services.map(service => {
              const serviceOpt = serviceOptions.find(s => s.id === service);
              const isSelected = selectedServices.includes(service);
              return (
                <TouchableOpacity
                  key={service}
                  style={[styles.serviceOption, isSelected && styles.serviceOptionSelected]}
                  onPress={() => toggleService(service)}
                >
                  <View style={styles.checkboxContainer}>
                    {Platform.OS === 'web' ? (
                      <CheckBox
                        value={isSelected}
                        onChange={() => toggleService(service)}
                      />
                    ) : (
                      <View
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxChecked,
                        ]}
                      >
                        {isSelected && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                    )}
                  </View>
                  <View style={styles.serviceInfoContainer}>
                    <Text style={styles.serviceName}>{serviceOpt?.name}</Text>
                    <Text style={styles.serviceDescription}>
                      {serviceOpt?.description}
                    </Text>
                  </View>
                  <Text style={styles.servicePrice}>+${serviceOpt?.basePrice}</Text>
                </TouchableOpacity>
              );
            })}

            <View style={styles.priceEstimate}>
              <Text style={styles.priceLabel}>Est. Total:</Text>
              <Text style={styles.priceValue}>${estimatedPrice}+</Text>
            </View>
          </View>
        )}

        {/* Date/Time Step */}
        {step === 'datetime' && (
          <View>
            <Text style={styles.title}>When do you need pickup?</Text>
            <Text style={styles.subtitle}>Select pickup and return times</Text>

            <View style={styles.dateTimeForm}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Pickup Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Friday, March 15"
                  value={pickupDate}
                  onChangeText={setPickupDate}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Pickup Time</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 5:00 PM"
                  value={pickupTime}
                  onChangeText={setPickupTime}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.formGroup}>
                <Text style={styles.label}>Return Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Sunday, March 17"
                  value={returnDate}
                  onChangeText={setReturnDate}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Return Time</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 10:00 AM"
                  value={returnTime}
                  onChangeText={setReturnTime}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Special Notes (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="e.g., Stain on favorite sweater, please be careful"
                  value={specialNotes}
                  onChangeText={setSpecialNotes}
                  multiline
                  maxLength={200}
                />
                <Text style={styles.charCount}>{specialNotes.length}/200</Text>
              </View>
            </View>
          </View>
        )}

        {/* Review Step */}
        {step === 'review' && (
          <View>
            <Text style={styles.title}>Review Your Booking</Text>

            <View style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Sudser</Text>
                <Text style={styles.reviewValue}>{sudser.name} ⭐ {sudser.rating}</Text>
              </View>

              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Services</Text>
                <Text style={styles.reviewValue}>
                  {selectedServices
                    .map(s => serviceOptions.find(opt => opt.id === s)?.name)
                    .join(', ')}
                </Text>
              </View>

              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Pickup</Text>
                <Text style={styles.reviewValue}>{pickupDate} @ {pickupTime}</Text>
              </View>

              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Return</Text>
                <Text style={styles.reviewValue}>{returnDate} @ {returnTime}</Text>
              </View>

              {specialNotes && (
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Notes</Text>
                  <Text style={styles.reviewValue}>{specialNotes}</Text>
                </View>
              )}

              <View style={[styles.reviewRow, styles.reviewRowHighlight]}>
                <Text style={styles.reviewLabel}>Est. Price</Text>
                <Text style={styles.reviewPrice}>${estimatedPrice}+</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Button Controls */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
          <Text style={styles.secondaryButtonText}>
            {step === 'services' ? 'Cancel' : 'Back'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={
            step === 'review' ? handleConfirmBooking : handleNextStep
          }
        >
          <Text style={styles.primaryButtonText}>
            {step === 'review' ? '✓ Confirm Booking' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
  },
  progressDotActive: {
    backgroundColor: '#00D4FF',
  },
  progressLine: {
    width: 30,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: '#00D4FF',
  },
  stepLabel: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    paddingVertical: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  serviceOptionSelected: {
    borderColor: '#00D4FF',
    backgroundColor: '#E0F7FF',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: '#00D4FF',
    backgroundColor: '#00D4FF',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  serviceInfoContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#999',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00D4FF',
  },
  priceEstimate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00D4FF',
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00D4FF',
  },
  dateTimeForm: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2C3E50',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reviewRowHighlight: {
    backgroundColor: '#E0F7FF',
    paddingHorizontal: 10,
    borderBottomWidth: 0,
    borderRadius: 6,
    marginTop: 8,
  },
  reviewLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#999',
  },
  reviewValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'right',
    flex: 1,
  },
  reviewPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00D4FF',
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#00D4FF',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
});
